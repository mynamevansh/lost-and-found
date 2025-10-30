# 🔐 Google Sign-In Setup Guide

## ✅ What I've Fixed in Your Code

1. **Simplified Google Sign-In initialization** - Now properly waits for GSI script to load
2. **Fixed CORS configuration** - Backend now accepts requests from all required origins
3. **Added proper error handling** - Better console logs and user feedback
4. **Removed duplicate code** - Cleaned up script.js to avoid conflicts

## 🚨 CRITICAL: Google Cloud Console Setup

You **MUST** add these origins to your Google Cloud Console for the sign-in to work:

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (the one with Client ID: `488982088796-tn18otp49ta7qju1cm93bmd187d4eiab`)

### Step 2: Configure OAuth Consent Screen
1. In left menu: **APIs & Services** → **OAuth consent screen**
2. Make sure your app is published or in testing mode
3. Add your email as a test user if in testing mode

### Step 3: Add Authorized JavaScript Origins
1. In left menu: **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID: `488982088796-tn18otp49ta7qju1cm93bmd187d4eiab`
3. Click the pencil icon (✏️) to edit
4. Scroll to **Authorized JavaScript origins**
5. Click **+ ADD URI** and add these **EXACT** URLs:
   ```
   http://localhost:5500
   http://127.0.0.1:5500
   http://localhost
   http://127.0.0.1
   ```

### Step 4: Add Authorized Redirect URIs (Optional but Recommended)
1. In the same page, scroll to **Authorized redirect URIs**
2. Add these if not already present:
   ```
   http://localhost:5500/main.html
   http://127.0.0.1:5500/main.html
   ```

### Step 5: Save Changes
1. Click **SAVE** at the bottom
2. **IMPORTANT**: Wait 5-10 minutes for changes to propagate

---

## 🧪 Testing Your Google Sign-In

### Test Checklist:
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5500
- [ ] Added origins in Google Cloud Console
- [ ] Waited 5-10 minutes after saving changes
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Opened in incognito/private window for clean test

### How to Test:
1. Open: http://localhost:5500/index.html
2. Click on the Google icon (your custom logo)
3. You should see the Google Sign-In popup
4. Select your Google account
5. Should redirect to main.html with token stored

### If You See Errors:

#### "The given origin is not allowed for the given client ID"
**Solution**: Add the origins in Google Cloud Console (see Step 3 above)

#### "Can't continue with google.com. Something went wrong."
**Solution**: 
- Make sure OAuth consent screen is configured
- Add yourself as test user if app is in testing mode
- Check that your Google account email is verified

#### "Server did not send the correct CORS headers"
**Solution**: This is already fixed in your backend. Make sure server restarted.

#### Popup doesn't show
**Solution**:
- Check browser console (F12) for errors
- Make sure Google GSI script loaded (look for ✅ message)
- Try clicking after page fully loads (wait 2-3 seconds)

---

## 🔍 How the Flow Works Now

1. **Page loads** → Google GSI script loads
2. **GSI initializes** → `google.accounts.id.initialize()` called
3. **User clicks Google icon** → `google.accounts.id.prompt()` triggered
4. **Google popup appears** → User selects account
5. **Token received** → `handleGoogleSignIn()` callback fires
6. **Token sent to backend** → `POST /api/users/google-login`
7. **Backend verifies token** → Creates/finds user, returns JWT
8. **JWT stored** → `localStorage.setItem('userToken', ...)`
9. **Redirect** → User goes to `main.html`

---

## 📝 Your Current Configuration

**Client ID**: `488982088796-tn18otp49ta7qju1cm93bmd187d4eiab.apps.googleusercontent.com`

**Required Origins** (must be in Google Console):
- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `http://localhost`
- `http://127.0.0.1`

**Backend Endpoint**: `http://localhost:5000/api/users/google-login`

**CORS**: ✅ Properly configured in server.js

---

## 🐛 Debug Commands

### Check if backend is running:
```powershell
curl http://localhost:5000/api/users/login
```

### Check CORS headers:
```powershell
curl -H "Origin: http://localhost:5500" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://localhost:5000/api/users/google-login -v
```

### View browser console:
Press `F12` in your browser and check for:
- ✅ "Google Sign-In initialized successfully"
- "Triggering Google Sign-In popup..."
- Any red error messages

---

## 🎯 Next Steps

1. ✅ **Code is ready** - All fixes applied
2. ⏳ **Add origins in Google Cloud Console** - Follow Step 3 above
3. ⏳ **Wait 5-10 minutes** - For Google changes to propagate
4. ✅ **Test** - Click your custom Google logo and sign in!

---

## 💡 Tips

- Always test in **incognito mode** to avoid cached credentials
- The custom Google logo button now works exactly like the official Google button
- Check browser console (F12) for detailed logs
- If still having issues, verify your Google Client ID is correct
- Make sure you're using the same Google account that's authorized in testing mode

---

**Last Updated**: Code updated and backend restarted with proper CORS configuration
**Status**: ✅ Code ready | ⏳ Waiting for Google Cloud Console setup
