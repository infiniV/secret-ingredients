---
name: theme-checker
description: Analyzes codebase for theme consistency, checking CSS variables, color usage, and design token adherence across components
category: code-quality
icon: palette
---

# Theme Checker

Check a codebase for theme consistency and flag violations.

## When to Use

Use this skill when you need to:
- Audit a codebase for inconsistent color usage
- Verify design token adherence
- Find hardcoded colors that should use CSS variables
- Ensure dark mode compatibility

## Process

1. **Scan for color definitions** - Find all CSS files, Tailwind configs, and inline styles
2. **Identify violations** - Flag hardcoded hex/rgb values that should use variables
3. **Check variable usage** - Verify components use theme variables correctly
4. **Report findings** - Summarize issues by severity and file

## What to Check

- Hardcoded colors in CSS/Tailwind classes
- Missing dark mode variants
- Inconsistent variable naming
- Unused theme variables
- Direct color values in component styles

## Output Format

Provide a report with:
- Total files scanned
- Violations found (grouped by type)
- Recommended fixes
- Severity rating (critical/warning/info)
