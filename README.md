# 🚀 TuteDevHack Hackathon Project

Welcome to the team! This guide will help you get started, even if you're new to Git or collaborative development.

---

## 📁 Project Structure

```
/hackathon-project
├── frontend/ → Next.js + TypeScript + TailwindCSS(Frontend)
├── backend/ → Node.js + Express.js (Backend)
├── ai/ → Python for AI/ML (Inference, Models, etc.)
├── README.md → This file!
└── .gitignore → Files/folders to ignore in Git
```

---

## 🌿 Branching Structure

We follow a Git branching model where each team member works in their own feature branch.

| Branch Name          | Purpose                    | Assigned To            |
|----------------------|----------------------------|------------------------|
| `feature/frontendH`  | Frontend Dev H features    | Frontend Teammate H    |
| `feature/frontendS`  | Frontend Dev S features    | Frontend Teammate S    |
| `feature/backendP`   | Backend APIs and logic     | Backend Teammate       |
| `feature/aiR`        | AI/ML development          | AI Engineer            |
| `develop`            | Merged & tested features   | Integrator             |
| `main`               | Final release-ready code   | Everyone!              |

✅ Branches are only merged into `develop` first → then into `main` once everything is tested.

---

## 🚀 Getting Started (No Git Experience Needed)

### 1. ✅ Install Git
- Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Follow installation steps for your OS (Windows/macOS/Linux)

### 2. ✅ Clone the Repo

```bash

git clone https://github.com/OFF-rtk/TuteDevHack.git
cd TuteDevHack

```

### 3. ✅ Switch to Your Assigned Branch

```bash

git fetch
git checkout feature/<your-branch-name>

```
(Replace `<your-branch-name>` with your assigned one)

---

## 🛠️ Making Changes

1. Change files in your directory:
   - `frontend/` → if you're a frontend dev
   - `backend/` → if you're the backend dev
   - `ai/` → if you're working on AI logic

2. Stage, commit, and push your work:

    ```bash

    git add .
    git commit -m "🛠️ Describe what you did"
    git push origin feature/<your-branch-name>

    ```

---

## 🔄 Pull Request Workflow

When you’re done working and want to share your updates:

1. Navigate to the [GitHub repo](https://github.com/OFF-rtk/TuteDevHack)
2. Click **Pull Requests** → **New Pull Request**
3. Set:
   - **Base branch** = `develop`
   - **Compare branch** = your `feature/*` branch
4. Click **Create pull request**
5. The integrator will test it, then merge to `develop`

---

## 📋 Common Git Commands Cheat Sheet

| Task                            | Git Command                                        |
|---------------------------------|----------------------------------------------------|
| Clone the repo                  | `git clone <repo-url>`                             |
| Create/switch to a branch       | `git checkout -b feature/your-name`                |
| Move to an existing branch      | `git checkout feature/your-name`                   |
| See all branches                | `git branch -a`                                    |
| Pull latest code                | `git pull origin main`                             |
| Stage files for commit          | `git add .`                                        |
| Commit your changes             | `git commit -m "message"`                          |
| Push changes to GitHub          | `git push origin feature/your-name`                |
| Delete a branch (local)         | `git branch -d feature/old-branch`                 |

---

## 🛡️ Best Practices

- ❌ Never commit on `main` or `develop` directly.
- ✅ Always work on your assigned `feature/*` branch.
- 🔁 Run `git pull origin <branch>` often to stay synced.
- 🧪 Test your work before opening a PR.
- 🔐 Never commit `.env` files (use `.env.example` as template).

---

## 💬 Need Help?

Feel stuck or confused? Ask the team lead or message in the group chat — we’re here to help each other! No judgment — we all started somewhere. 🎯

---

## Themes

| 🧱 Component       | Background                             | Hover / Focus Styles                                  | Text Color                         | Variants                  | Type / Tag     | Effects / Animations                                        | Utility Classes                                                                 |
|--------------------|----------------------------------------|--------------------------------------------------------|-------------------------------------|----------------------------|----------------|----------------------------------------------------------------|----------------------------------------------------------------------------------|
| **Button (Primary)** | `bg-[var(--color-accent)]`            | `hover:bg-indigo-700`                                  | `text-white`                        | `primary`                 | `<button>`     | `transition`, `hover:-translate-y-1`, `duration-150`         | `px-5 py-2 rounded-[var(--radius)] font-semibold`                               |
| **Button (Light)**   | `bg-gray-200`                         | `hover:bg-gray-300`                                    | `text-gray-700`                     | `light`                   | `<button>`     | `transition`                                                 | `px-4 py-2 rounded-[var(--radius)]`                                             |
| **Button (Outline)** | `bg-transparent border border-gray-300` | `hover:border-[var(--color-accent)]`                 | `text-[var(--color-accent)]`        | `outline`                 | `<button>`     | `transition`, `hover:shadow-sm`                               | `px-5 py-2 rounded-[var(--radius)] font-medium`                                 |
| **Card**             | `bg-[var(--surface)]`                | `hover:shadow-lg`                                      | `text-[var(--color-foreground)]`    | `default`, `highlight`    | `<div>`        | `transition`, `duration-300`, `shadow-sm`                    | `rounded-[var(--radius)] p-6 shadow-sm`                                         |
| **Card (Glass)**     | `bg-white/70 backdrop-blur`           | `hover:shadow-lg`                                      | `text-[var(--color-foreground)]`    | `glass`                   | `<div>`        | `transition`, `duration-300`, `backdrop-blur`                | `rounded-[var(--radius)] p-8 bg-white/70 backdrop-blur-md shadow`               |
| **Heading (h1-h6)**  | *inherit*                             | —                                                      | `text-[var(--color-foreground)]`    | —                          | `<h1>` – `<h6>` | —                                                              | `font-bold text-2xl xl:text-4xl mb-2`                                           |
| **Paragraph**        | *inherit*                             | —                                                      | `text-[var(--color-muted)]`         | —                          | `<p>`          | —                                                              | `text-base leading-relaxed`                                                    |
| **Input**            | `bg-[var(--surface)]`                | `focus:ring-[var(--color-accent)] focus:outline-none` | `text-[var(--color-foreground)]`    | `default`                 | `<input>`      | `transition`, `ring`, `duration-150`                        | `rounded-[var(--radius)] px-3 py-2 border border-gray-300 w-full`              |
| **Textarea**         | Same as Input                         | Same as Input                                           | Same as Input                        | —                          | `<textarea>`   | Same                                                         | Same                                                                             |
| **Select**           | Same as Input                         | Same as Input                                           | Same as Input                        | —                          | `<select>`     | Same                                                         | Same                                                                             |
| **Badge**            | `bg-[var(--color-accent2)]`           | `hover:bg-[#ff8c75]`                                   | `text-white`                        | `default`, `pill`, `tag`  | `<span>`       | `transition`, `duration-150`                                 | `inline-block px-3 py-1 rounded-2xl text-xs font-medium`                        |
| **Alert**            | `bg-[var(--color-accent2)]/20`        | —                                                      | `text-[var(--color-text)]`          | `warning`, `info`, `error` | `<div>`        | `animate-pulse`, `border-l-4 border-[var(--color-accent2)]` | `rounded-lg p-4`                                                                 |
| **Link**             | `transparent`                         | `hover:text-[var(--color-accent)] underline`          | `text-[var(--color-foreground)]`    | `primary`, `inline`, `menu`| `<a>`          | `transition`, `underline-offset-4`                         | `font-medium transition duration-150`                                           |

---


🏁 **Let’s ship something awesome!** 🧠🚀

