# JSON Differ - The Complete Data Transformation Platform

> A privacy-first, feature-rich JSON/YAML/XML comparison and conversion tool built with Next.js and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 What is JSON Differ?

A professional-grade, all-in-one tool for developers that combines:

🔍 **JSON Comparison** - Side-by-side diff with advanced options
🔄 **Format Conversion** - JSON ↔ YAML ↔ XML
✅ **Schema Validation** - Validate against JSON Schema Draft 07
📚 **History Management** - Save and organize your work
🔐 **Privacy-First** - Client-side processing option
🌐 **REST API** - Programmatic access for automation

**Live Demo:** https://yourdomain.com/differ

---

## ✨ All Features (4 Tabs)

### 1. Compare Tab
- Monaco Editor (VS Code quality)
- Real-time validation
- Ignore key/array order
- Export: JSON, HTML, Markdown, Text
- Share links

### 2. Convert Tab ✨ NEW
- JSON ↔ YAML ↔ XML
- Auto-detect format
- Sample data
- Download/Copy

### 3. Validate Tab
- JSON Schema validation
- Schema templates
- Auto-generate schema
- Detailed errors

### 4. History Tab
- Save comparisons
- Load previous work
- Public/private sharing
- Search & organize

---

## 🚀 Quick Start

```bash
# Install
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase credentials

# Run database migration
# (Copy supabase/migrations/*.sql to Supabase SQL Editor)

# Start
npm run dev
```

Visit http://localhost:3000

**Full Setup Guide:** [SETUP.md](./SETUP.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](./SETUP.md) | 5-minute setup guide |
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Complete technical details |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | REST API reference |
| [MARKET_ANALYSIS.md](./MARKET_ANALYSIS.md) | Market potential & revenue |
| [PHASE_3_SUMMARY.md](./PHASE_3_SUMMARY.md) | Latest features |
| [COMPLETE_SUMMARY.md](./COMPLETE_SUMMARY.md) | Everything in one place |

---

## 🌐 REST API

```bash
# Compare JSON
POST /api/v1/diff
{
  "original": {...},
  "modified": {...}
}

# Validate Schema
POST /api/v1/validate
{
  "json": {...},
  "schema": {...}
}

# Format JSON
POST /api/v1/format
{
  "json": {...},
  "tabSize": 2
}
```

**Rate Limit:** 100 req/min
**Full Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📊 Market Opportunity

### Target Market
- **27M developers worldwide**
- **180K+ monthly searches** for JSON/YAML/XML tools
- **Year 1 Target:** 25,000-50,000 users

### Revenue Potential
| Scenario | Users | ARR |
|----------|-------|-----|
| Conservative | 15,000 | $37,800 |
| Moderate | 35,000 | $102,900 |
| Optimistic | 60,000 | $201,600 |

**Details:** [MARKET_ANALYSIS.md](./MARKET_ANALYSIS.md)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Editor:** Monaco Editor
- **UI:** Tailwind CSS + Radix UI
- **Parsers:** js-yaml, fast-xml-parser, AJV
- **Deploy:** Vercel

---

## 🎯 Use Cases

**DevOps:** Convert Kubernetes YAML, validate configs
**Backend:** Debug API responses, validate payloads
**Frontend:** Compare package.json, debug state
**Data:** Transform exports, validate structures

---

## 📈 Roadmap

✅ Phase 1 - JSON Comparison (Complete)
✅ Phase 2 - Schema Validation + API (Complete)
✅ Phase 3 - Format Conversion (Complete)
🚧 Phase 4 - AI Summaries, Git Integration (Optional)

---

## 🔐 Privacy & Security

- **Client-side processing** (Privacy Mode ON by default)
- **Row-level security** for saved diffs
- **Rate limiting** on API
- **XSS protection**

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

```bash
git checkout -b feature/amazing-feature
npm run dev
npm run build
git push origin feature/amazing-feature
```

---

## 📝 License

MIT License - Free to use and modify

---

## 🙏 Credits

- Next.js - React Framework
- Supabase - Backend Platform
- Monaco Editor - Code Editor
- Radix UI - UI Components

---

## 📞 Support

- **Docs:** https://yourdomain.com/docs
- **Issues:** [GitHub Issues](https://github.com/yourusername/json-differ/issues)
- **Email:** support@yourdomain.com

---

**Built with ❤️ by developers, for developers**

**Version:** 3.0.0
**Status:** Production Ready
**Last Updated:** 2025-01-01

[Get Started →](https://yourdomain.com/differ)
