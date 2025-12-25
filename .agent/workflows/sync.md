---
description: how to pull, merge and push changes safely
---

To keep your local code in sync with the remote repository and safely push your changes, follow these steps.

### 1. Sync with Remote
Before starting any new work, always pull the latest changes from the main branch.
// turbo
```bash
git pull origin main
```

### 2. Create a Feature Branch (Optional but Recommended)
If you're working on a specific feature, it's best to do it in a separate branch.
```bash
git checkout -b feature/your-feature-name
```

### 3. Stage and Commit Changes
Once you've made your changes, stage them and commit with a descriptive message.
```bash
git add .
git commit -m "Brief description of the changes"
```

### 4. Merge into Main
When you're ready to merge your feature into the main branch:
```bash
git checkout main
git merge feature/your-feature-name
```

### 5. Push to GitHub
Finally, push the merged changes back to your remote repository.
// turbo
```bash
git push origin main
```

### Pro-tip: Handling Conflicts
If you encounter merge conflicts:
1. Open the conflicted files.
2. Look for the `<<<<<<<`, `=======`, and `>>>>>>>` markers.
3. Edit the code to keep what you want.
4. Stage the resolved files and commit them.
