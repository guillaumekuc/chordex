// /src/actions/Search.js
import SearchParser from '../utils/SearchParser.js';
import ChordRelationships from '../theory/ChordRelationships.js';
import Scales from '../theory/Scales.js';
import debugLog from '../utils/debugLog.js';

export default class Search {
  static defaultFilters(store = null) {
    return { 
      query: '', 
      root: [], 
      intervals: [], 
      target: [], 
      scales: [], 
      commonTones: [], 
      fifthsOffsets: store?.config?.extendedScales ? [0] : [],
      queryTags: [], // Tags from query (OR logic with query)
      filterTags: [], // Tags from filter panel (AND logic)
      selected: false
    };
  }

  static execute(data, f = this.defaultFilters(), selectedItems = []) {
    let results = data;

    // Helper function to check if a CR matches a specific tag
    const matchesTag = (cr, tagName) => {
      const crTags = Array.isArray(cr.tags) ? cr.tags : [];
      if (crTags.length === 0) return false;
      const crTagsLower = crTags.map(tag => tag.toLowerCase());
      const tagLower = tagName.toLowerCase();
      return crTagsLower.some(crTag => crTag.includes(tagLower));
    };

    // Helper function to check if a CR matches tag filters (OR logic for filter panel)
    const matchesFilterTags = (cr) => {
      if (!f.filterTags?.length) return true; // No filter tags = no restriction
      return f.filterTags.some(filterTag => matchesTag(cr, filterTag));
    };

    // Helper function to check if a term (text or tag) matches a CR
    const matchesTerm = (cr, term) => {
      const trimmed = term.trim();
      if (!trimmed) return false;
      
      // Check if this term is a tag (starts with #)
      if (trimmed.startsWith('#')) {
        const tagName = trimmed.substring(1).trim();
        if (!tagName) return false;
        return matchesTag(cr, tagName);
      }
      
      // Otherwise, treat as text query
      return SearchParser.matchSingleTerm(cr, trimmed);
    };

    // Helper function to match complex queries that may include tags
    const matchesComplexQueryWithTags = (cr, query) => {
      const terms = SearchParser.parseComplexQuery(query);
      const includeTerms = terms.filter(term => term.operator === "include" && term.term.trim());
      const excludeTerms = terms.filter(term => term.operator === "exclude" && term.term.trim());

      // All include terms must match (AND logic)
      // If no include terms (e.g., just a trailing +), don't match anything
      const includeMatch =
        includeTerms.length > 0 &&
        includeTerms.every(term => matchesTerm(cr, term.term));

      // No exclude terms should match
      const excludeMatch =
        excludeTerms.some(term => matchesTerm(cr, term.term));

      return includeMatch && !excludeMatch;
    };

    // Helper function to check if a CR matches query (comma-separated OR logic)
    // Handles both text queries and tags in the query string
    const matchesQuery = (cr) => {
      if (!f.query || !f.query.trim()) return false;
      
      // Split by comma for OR logic
      const parts = f.query.split(',').map(part => part.trim()).filter(Boolean);
      
      return parts.some(part => {
        // Check if this part contains + or - (complex query)
        if (part.includes('+') || part.includes('-')) {
          return matchesComplexQueryWithTags(cr, part);
        }
        
        // Simple term (single tag or text)
        return matchesTerm(cr, part);
      });
    };

    // 1) Query (comma-separated OR logic, includes tags in query)
    if (f.query && f.query.trim()) {
      results = results.filter(cr => matchesQuery(cr));
    }

    // 2) Filter panel tags (OR logic - any can match, like scales)
    if (f.filterTags?.length > 0) {
      results = results.filter(cr => matchesFilterTags(cr));
    }

    // 3) root quality
    if (f.root?.length) {
      results = results.filter(cr => f.root.includes(cr.rootQuality));
    } 

    // 4) intervals
    if (f.intervals?.length) {
      results = results.filter(cr => f.intervals.includes(cr.pitchClass));
    }

    // 5) target quality
    if (f.target?.length){ 
      results = results.filter(cr => f.target.includes(cr.targetQuality));
    }

    
    if (f.fifthsOffsets?.length) {
      debugLog('Filtering by fifthsOffsets:', f.fifthsOffsets, '→', results.length, 'results');

      // filteredScales is an array of objects that have a .label property
      const filteredScales = Scales.all.filter(scale =>
        f.fifthsOffsets.includes(scale.fifthsOffset)
      );
      if (filteredScales.length) {
        results = results.filter(cr => {
          // cr.scales is an array of strings; filteredScales is array of objects with .label
          const hasMatch = cr.scales.some(scale =>
            filteredScales.some(filteredScale => filteredScale.label === scale)
          );
          return hasMatch;
        });
      }
    }
    
    // 6) scales
    if (f.scales?.length) {
      results = results.filter(cr =>
        Array.isArray(cr.scales) && cr.scales.some(scale => f.scales.includes(scale))
      );
    }
    

    // 7) common tones
    if (f.commonTones?.length) results = results.filter(cr => f.commonTones.includes(cr.commonTones));

    // 8) selected filter
    if (f.selected === true && Array.isArray(selectedItems)) {
      const selectedUids = new Set(selectedItems.map(item => item.uid));
      results = results.filter(cr => selectedUids.has(cr.uid));
    }

    debugLog('Search complete:', results.length, 'results from', data.length, 'total');
    return results;
  }
}