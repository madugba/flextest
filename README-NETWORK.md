# Network Access - Quick Reference

## 🚀 Quick Start (Cross-Device Access)

FlexTest automatically detects your local IP for cross-device testing!

### 1. Check Your Network URLs
```bash
npm run network-info
```

Output:
```
✅ Primary Network IP (en0):
   Frontend:  http://10.195.253.27:3001
   Backend:   http://10.195.253.27:3000
   API:       http://10.195.253.27:3000/v1/api
```

### 2. Start Servers
```bash
# Terminal 1
cd flextest-backend && npm run dev

# Terminal 2
cd flextest && npm run dev
```

### 3. Access from Any Device
Open `http://10.195.253.27:3001` on any device connected to the same WiFi.

---

## How It Works

### Automatic IP Detection (Development)

The app automatically:
1. Detects your local network IP using Node.js `os.networkInterfaces()`
2. Replaces `localhost` with your actual IP (e.g., `10.195.253.27`)
3. Uses this IP for all API calls

**Files:**
- `src/shared/lib/get-local-ip.ts` - IP detection utility
- `src/shared/config/index.ts` - Config with auto-detection

### Server Configuration

Both servers listen on `0.0.0.0` (all network interfaces):

**Frontend** (`package.json`):
```json
"dev": "next dev --turbopack -p 3001 -H 0.0.0.0"
```

**Backend** (`.env.local`):
```env
HOST=0.0.0.0
```

---

## Manual Override (Optional)

If you need to manually set the API URL:

**`.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:3000/v1/api
```

This will override automatic detection.

---

## Production Setup

For production, always set explicit URLs:

**`.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1/api
```

---

## Troubleshooting

### Can't Connect from Other Devices

1. **Check Firewall:**
   ```bash
   # macOS - Allow Node.js
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
   ```

2. **Verify Same Network:**
   - Both devices must be on same WiFi
   - Corporate/Public WiFi may block device-to-device connections

3. **Check IP Changed:**
   ```bash
   npm run network-info  # Re-check your IP
   ```

4. **Restart Dev Server:**
   - Stop with `Ctrl+C`
   - Clear cache: `rm -rf .next`
   - Start again: `npm run dev`

### API Still Using localhost

**Clear browser cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear cache in DevTools > Network > Disable cache

---

## See Also

- Full guide: [NETWORK-ACCESS.md](../NETWORK-ACCESS.md)
- Main README: [README.md](../README.md)
