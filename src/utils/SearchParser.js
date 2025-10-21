
export default class SearchParser {
  static normalizeUnicode(value) {
    return (value || "").normalize("NFKC");
  }

  /** Turn a raw term into normalized pieces for matching */
  static parseSearchTerm(term) {
    const isExactMatch = term.startsWith('"') && term.endsWith('"') && term.length > 2;
    const raw = isExactMatch ? term.slice(1, -1) : term;

    const normalized = this.normalizeUnicode(raw);
    const lower = normalized.toLowerCase();

    // For scale matching: allow user to type b/# or ♭/♯; compare case-insensitively
    const scaleQuery = lower
      .replace(/b(\d)/g, "♭$1")
      .replace(/#(\d)/g, "♯$1");

    // For label/alias matching: DO NOT alter letters. Compare case-insensitively later.
    const textQuery = normalized;

    return { isExactMatch, scaleQuery, textQuery, lowerTextQuery: lower };
  }

  /** Parse + for includes / - for excludes with optional quoted phrases */
  static parseComplexQuery(query) {
    const terms = [];
    let current = "";
    let inQuotes = false;
    let operator = "include";

    for (let i = 0; i < query.length; i++) {
      const char = query[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (!inQuotes && (char === "+" || char === "-")) {
        if (current.trim()) {
          terms.push({ term: current.trim(), operator });
        }
        operator = char === "+" ? "include" : "exclude";
        current = "";
      } else if (!inQuotes && char === " ") {
        if (current.trim()) {
          current += char;
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      terms.push({ term: current.trim(), operator });
    }

    return terms;
  }

  /** Does one parsed term match this CR record? */
  static matchesItem(cr, parsedTerm) {
    const { isExactMatch, scaleQuery, textQuery, lowerTextQuery } = parsedTerm;

    // Normalize item fields once
    const label = this.normalizeUnicode(cr.label || "");
    const aliases = Array.isArray(cr.aliases) ? cr.aliases.map(this.normalizeUnicode) : [];
    const scales = Array.isArray(cr.scales) ? cr.scales.map(this.normalizeUnicode) : [];

    // Case-insensitive helpers
    const toLower = (s) => s.toLowerCase();


    // LABEL: case-sensitive
    const nameMatch = isExactMatch
      ? label === textQuery
      : label.includes(textQuery);

    //ALIASES: case-insensitive, do not mutate letters
    const aliasMatch = isExactMatch
      ? aliases.some((a) => toLower(a) === toLower(textQuery))
      : aliases.some((a) => toLower(a).includes(lowerTextQuery));

    // SCALES: case-insensitive with ♭/♯ handling; also try ASCII fallback (b/#)
    const scalesLower = scales.map(toLower);
    const scaleQueryAscii = scaleQuery.replace(/♭/g, "b").replace(/♯/g, "#");

    const scaleMatch = isExactMatch
      ? scalesLower.some((s) => s === scaleQuery || s === scaleQueryAscii)
      : scalesLower.some((s) => s.includes(scaleQuery) || s.includes(scaleQueryAscii));

    return nameMatch || aliasMatch || scaleMatch;
  }

  static matchSingleTerm(cr, query) {
    return this.matchesItem(cr, this.parseSearchTerm(query));
  }

  static matchComplexQuery(cr, query) {
    const terms = this.parseComplexQuery(query);
    const includeTerms = terms.filter((t) => t.operator === "include");
    const excludeTerms = terms.filter((t) => t.operator === "exclude");

    const includeMatch =
      includeTerms.length === 0 ||
      includeTerms.every((t) => this.matchesItem(cr, this.parseSearchTerm(t.term)));

    const excludeMatch =
      excludeTerms.some((t) => this.matchesItem(cr, this.parseSearchTerm(t.term)));

    return includeMatch && !excludeMatch;
  }
}
