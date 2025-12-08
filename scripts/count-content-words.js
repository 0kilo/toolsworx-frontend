#!/usr/bin/env node

/**
 * Content Word Counter for AdSense Compliance
 *
 * Counts words in all tool JSON files to verify they meet the 500+ word requirement
 * for Google AdSense policy compliance.
 *
 * Usage: node scripts/count-content-words.js [--detailed] [--under-500]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Parse command line args
const args = process.argv.slice(2);
const showDetailed = args.includes('--detailed');
const showUnder500Only = args.includes('--under-500');

/**
 * Count words in a string, excluding HTML tags
 */
function countWords(text) {
  if (!text) return 0;
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]+>/g, ' ');
  // Split by whitespace and filter empty strings
  const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Count total words in a tool's sections
 */
function countToolWords(toolData) {
  if (!toolData.sections || !Array.isArray(toolData.sections)) {
    return { total: 0, sections: [] };
  }

  const sectionCounts = toolData.sections.map(section => {
    let sectionWords = 0;

    // Count title words
    if (section.title) {
      sectionWords += countWords(section.title);
    }

    // Count content words
    if (Array.isArray(section.content)) {
      section.content.forEach(item => {
        if (typeof item === 'string') {
          sectionWords += countWords(item);
        } else if (item && typeof item === 'object') {
          // Handle subsections
          if (item.title) sectionWords += countWords(item.title);
          if (Array.isArray(item.items)) {
            item.items.forEach(subitem => sectionWords += countWords(subitem));
          }
          if (Array.isArray(item.content)) {
            item.content.forEach(subitem => sectionWords += countWords(subitem));
          }
        }
      });
    }

    return {
      title: section.title || 'Untitled',
      words: sectionWords
    };
  });

  const total = sectionCounts.reduce((sum, s) => sum + s.words, 0);

  return {
    total,
    sections: sectionCounts
  };
}

/**
 * Find all tool JSON files
 */
function findToolJsonFiles() {
  const appDir = path.join(__dirname, '..', 'app');

  // Find all .json files in app directory, excluding certain patterns
  const pattern = path.join(appDir, '**/*.json');
  const files = glob.sync(pattern);

  // Filter out non-tool JSON files (like category-level configs)
  return files.filter(file => {
    const basename = path.basename(file);
    const dirname = path.dirname(file);

    // Exclude category-level JSON files
    if (basename === 'calculators.json' || basename === 'charts.json' ||
        basename === 'dev-tools.json' || basename === 'filters.json' ||
        basename === 'file-converters.json' || basename === 'media-converters.json' ||
        basename === 'unit-conversions.json' || basename === 'helpful-calculators.json' ||
        basename === 'app.json') {
      return false;
    }

    // Only include files where the JSON filename matches the directory name
    // e.g., temperature/temperature.json, bmi/bmi.json
    const dirName = path.basename(dirname);
    const fileName = path.basename(file, '.json');

    return dirName === fileName;
  });
}

/**
 * Main function
 */
function main() {
  console.log('📊 Content Word Counter for AdSense Compliance\n');
  console.log('Scanning tool JSON files...\n');

  const jsonFiles = findToolJsonFiles();
  const results = [];

  jsonFiles.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const wordCount = countToolWords(data);
      const relPath = path.relative(path.join(__dirname, '..'), file);

      results.push({
        file: relPath,
        id: data.id || 'unknown',
        title: data.title || 'Untitled',
        wordCount: wordCount.total,
        sections: wordCount.sections,
        meetsRequirement: wordCount.total >= 500
      });
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  });

  // Sort by word count (lowest first)
  results.sort((a, b) => a.wordCount - b.wordCount);

  // Filter if --under-500 flag is set
  const displayResults = showUnder500Only
    ? results.filter(r => !r.meetsRequirement)
    : results;

  // Display results
  console.log('═'.repeat(80));
  console.log(`Total Tools Analyzed: ${results.length}`);
  console.log(`Tools Meeting 500+ Words: ${results.filter(r => r.meetsRequirement).length}`);
  console.log(`Tools Under 500 Words: ${results.filter(r => !r.meetsRequirement).length}`);
  console.log('═'.repeat(80));
  console.log('');

  displayResults.forEach((result, index) => {
    const status = result.meetsRequirement ? '✅' : '❌';
    const percentage = result.meetsRequirement ? '100%' : `${Math.round((result.wordCount / 500) * 100)}%`;

    console.log(`${status} ${result.title}`);
    console.log(`   📁 ${result.file}`);
    console.log(`   📝 ${result.wordCount} words (${percentage} of 500 minimum)`);

    if (showDetailed) {
      console.log(`   📑 Sections:`);
      result.sections.forEach(section => {
        console.log(`      • ${section.title}: ${section.words} words`);
      });
    }

    if (!result.meetsRequirement) {
      const needed = 500 - result.wordCount;
      console.log(`   ⚠️  Need ${needed} more words to meet minimum`);
    }

    console.log('');
  });

  // Summary statistics
  console.log('═'.repeat(80));
  console.log('SUMMARY STATISTICS');
  console.log('═'.repeat(80));

  const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0);
  const avgWords = Math.round(totalWords / results.length);
  const minWords = results[0]?.wordCount || 0;
  const maxWords = results[results.length - 1]?.wordCount || 0;

  console.log(`Average Words per Tool: ${avgWords}`);
  console.log(`Minimum: ${minWords} words`);
  console.log(`Maximum: ${maxWords} words`);
  console.log(`Total Words Across All Tools: ${totalWords.toLocaleString()}`);
  console.log('');

  // Progress bar
  const completedCount = results.filter(r => r.meetsRequirement).length;
  const progress = Math.round((completedCount / results.length) * 100);
  const barLength = 50;
  const filledLength = Math.round((progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  console.log(`Progress: [${bar}] ${progress}%`);
  console.log(`(${completedCount}/${results.length} tools meet 500-word minimum)`);
  console.log('');

  // Exit code: 0 if all tools meet requirement, 1 otherwise
  process.exit(completedCount === results.length ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { countWords, countToolWords, findToolJsonFiles };
