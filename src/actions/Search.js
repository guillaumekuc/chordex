// /src/actions/Search.js
import SearchParser from '../utils/SearchParser.js';
import ChordRelationships from '../theory/ChordRelationships.js';


export default class Search {
  static defaultFilters() {
    return { query: '', root: [], intervals: [], target: [], scales: [], commonTones: [] };
  }

  static execute(out, f = this.defaultFilters()) {
    let results = ChordRelationships.all;

    // 1) text query
    if (f.query && f.query.trim()) {
      const queries = f.query.split(',').map(s => s.trim()).filter(Boolean);
      results = results.filter(cr =>
        queries.some(q =>
          (q.includes('+') || q.includes('-'))
            ? SearchParser.matchComplexQuery(cr, q)
            : SearchParser.matchSingleTerm(cr, q)
        )
      );
    }

    // 2) root quality
    if (f.root?.length) results = results.filter(cr => f.root.includes(cr.rootQuality));

    // 3) intervals
    if (f.intervals?.length) results = results.filter(cr => f.intervals.includes(cr.pitchClass));

    // 4) target quality
    if (f.target?.length) results = results.filter(cr => f.target.includes(cr.targetQuality));

    // 5) scales
    if (f.scales?.length) {
      results = results.filter(cr =>
        Array.isArray(cr.scales) && cr.scales.some(s => f.scales.includes(s))
      );
    }

    // 6) common tones
    if (f.commonTones?.length) results = results.filter(cr => f.commonTones.includes(cr.commonTones));

    return results;
  }
}