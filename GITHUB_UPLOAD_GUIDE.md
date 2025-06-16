# GitHub Upload Guide for ABC WORDS Extension

## Step-by-Step Instructions

### 1. Create a GitHub Account (if you don't have one)
- Go to [GitHub.com](https://github.com)
- Click "Sign up" and create an account
- Verify your email address

### 2. Create a New Repository
1. **Click the "+" icon** in the top-right corner of GitHub
2. **Select "New repository"**
3. **Fill in the details:**
   - **Repository name**: `ABC-WORDS-Chrome-Extension`
   - **Description**: "A Chrome extension that breaks Bengali and English words into syllables, displays meanings, and provides pronunciation playback"
   - **Visibility**: Choose "Public" (recommended) or "Private"
   - **Initialize with**: Check "Add a README file" (we'll replace it)
4. **Click "Create repository"**

### 3. Upload Your Files

#### Method 1: Using GitHub Web Interface (Easiest)
1. **Go to your new repository**
2. **Click "Add file" → "Upload files"**
3. **Drag and drop all your extension files:**
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `popup.html`
   - `styles.css`
   - `uninstalled.html`
   - `README.md`
   - `LICENSE`
   - `.gitignore`
4. **Add a commit message**: "Initial commit: ABC WORDS Chrome Extension"
5. **Click "Commit changes"**

#### Method 2: Using Git Commands (Advanced)
1. **Open Command Prompt/Terminal**
2. **Navigate to your extension folder**
3. **Run these commands:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ABC WORDS Chrome Extension"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ABC-WORDS-Chrome-Extension.git
   git push -u origin main
   ```

### 4. Create a Release (Optional but Recommended)
1. **Go to your repository**
2. **Click "Releases" on the right side**
3. **Click "Create a new release"**
4. **Fill in the details:**
   - **Tag version**: `v1.0.0`
   - **Release title**: "ABC WORDS v1.0.0 - Initial Release"
   - **Description**: Add release notes
5. **Upload a ZIP file** of your extension
6. **Click "Publish release"**

### 5. Share Your Extension

#### Share the Repository
- **Repository URL**: `https://github.com/YOUR_USERNAME/ABC-WORDS-Chrome-Extension`
- Share this link with others

#### Create a Download Link
1. **Go to your release page**
2. **Copy the download link** for the ZIP file
3. **Share this link** for direct downloads

## Repository Structure
Your GitHub repository should look like this:
```
ABC-WORDS-Chrome-Extension/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── styles.css
├── uninstalled.html
├── README.md
├── LICENSE
├── .gitignore
└── GITHUB_UPLOAD_GUIDE.md
```

## Tips for Better Presentation

### 1. Add Screenshots
- Take screenshots of your extension in action
- Upload them to the repository
- Add them to your README.md

### 2. Create a Demo Video
- Record a short video showing how the extension works
- Upload to YouTube or similar platform
- Add the link to your README.md

### 3. Add Topics/Tags
- Go to your repository settings
- Add topics like: `chrome-extension`, `bengali`, `education`, `pronunciation`, `syllables`

### 4. Update README
- Make sure your README.md is comprehensive
- Include clear installation instructions
- Add troubleshooting section

## Getting Help
If you encounter any issues:
1. Check GitHub's documentation
2. Search for similar issues on GitHub
3. Ask questions in GitHub Discussions (if enabled)

## Next Steps
After uploading to GitHub:
1. Share the repository link with others
2. Consider adding more features
3. Respond to issues and pull requests
4. Keep the extension updated

---

**Note**: Make sure all your files are properly formatted and the extension works correctly before uploading to GitHub. 