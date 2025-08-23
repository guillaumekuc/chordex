// /src/utils/SearchParser.js
export default class SearchParser {

  /** Turn a raw term into normalized pieces for matching */
  static parseSearchTerm(term) {
    const isExactMatch = term.startsWith('"') && term.endsWith('"') && term.length > 2;
    const searchTerm = isExactMatch ? term.slice(1, -1) : term;

    return {
      isExactMatch,

      // replace flats/sharps only when followed by a digit for scale strings (e.g., ♯4)
      scaleQuery: searchTerm.toLowerCase().replace(/b(\d)/g, '♭$1').replace(/#(\d)/g, '♯$1'),

      // CR labels tweaks: flats, case for I/A/d
      crQuery: searchTerm.replace(/b/g, '♭').replace(/i/g, 'I').replace(/a/g, 'A').replace(/D/g, 'd')
    };
  }

  /** Parse + for includes / - for excludes with optional quoted phrases */
  static parseComplexQuery(query) {
    const terms = [];
    let current = '';
    let inQuotes = false;
    let operator = 'include';

    for (let i = 0; i < query.length; i++) {

      const char = query[i];
      // Handle quote characters - toggle quoted state and include in term
      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } 

      // Handle operators (+ or -) - only when not inside quotes
      else if (!inQuotes && (char === '+' || char === '-')) {
        // Save the current term if it exists
        if (current.trim()) { 
          terms.push({ term: current.trim(), operator });
        };
        // Set operator for the next term
        operator = char === '+' ? 'include' : 'exclude';
        current = '';
      } 

      // Handle spaces - only add to term if there's already content (avoid leading spaces)
      else if (!inQuotes && char === ' ') {
        if (current.trim()) current += char;
      }

      // Handle all other characters - add to current term
      else {
        current += char;
      }
    }

    //last term if it exists
    if (current.trim()) { 
      terms.push({ term: current.trim(), operator }); 
    };

    return terms;
  }

  /** Does one parsed term match this CR record? */
  static matchesItem(cr, parsedTerm) {
    const { isExactMatch, scaleQuery, crQuery } = parsedTerm;

    const normLabel = (cr.label || '');
    const normScales = Array.isArray(cr.scales) ? cr.scales : [];

    const nameMatch = isExactMatch ? normLabel === crQuery : normLabel.includes(crQuery);
    
    const scaleMatch = isExactMatch
      ? normScales.some(s => (s || '').toLowerCase() === scaleQuery)
      : normScales.some(s => (s || '').toLowerCase().includes(scaleQuery));

    return nameMatch || scaleMatch;
  }

  /** Convenience: test a simple (no + / -) term */
  static matchSingleTerm(cr, query) {
    return this.matchesItem(cr, this.parseSearchTerm(query));
  }

  /** Convenience: test a complex query with +include / -exclude */
  static matchComplexQuery(cr, query) {
    const terms = this.parseComplexQuery(query);
    const includeTerms = terms.filter(t => t.operator === 'include');
    const excludeTerms = terms.filter(t => t.operator === 'exclude');

    const includeMatch =
      includeTerms.length === 0 ||
      includeTerms.every(t => this.matchesItem(cr, this.parseSearchTerm(t.term)));
      
    const excludeMatch =
      excludeTerms.some(t => this.matchesItem(cr, this.parseSearchTerm(t.term)));

    return includeMatch && !excludeMatch;
  }
}
