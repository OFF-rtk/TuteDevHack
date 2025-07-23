# 🚀 TuteDevHack Hackathon Project

Welcome to the team! This guide will help you get started, even if you're new to Git or collaborative development.

---

## 📁 Project Structure

/hackathon-project
├── frontend/ → Next.js + TypeScript + TailwindCSS(Frontend)
├── backend/ → Node.js + Express.js (Backend)
├── ai/ → Python for AI/ML (Inference, Models, etc.)
├── README.md → This file!
└── .gitignore → Files/folders to ignore in Git

---

## 🌿 Branching Structure

We follow a Git branching model where each team member works in their own feature branch.

| Branch Name          | Purpose                    | Assigned To            |
|----------------------|----------------------------|------------------------|
| `feature/frontendH`  | Frontend Dev 1 features    | Frontend Teammate 1    |
| `feature/frontendS`  | Frontend Dev 2 features    | Frontend Teammate 2    |
| `feature/backendP`   | Backend APIs and logic     | Backend Teammate       |
| `feature/aiR`        | AI/ML development          | AI Engineer (You)      |
| `develop`            | Merged & tested features   | You (Integrator)       |
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
git checkout <your-branch-name>

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
    git push origin <your-branch-name>

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

🏁 **Let’s ship something awesome!** 🧠🚀

