# 🔊 Sound Files for HungerWood

## Required Sound Files

Place the following sound files in this directory:

1. **success.mp3** - Short success chime (< 1s)
2. **order-placed.mp3** - Happy notification sound (1-2s)
3. **coin.mp3** - Coin pickup sound (< 0.5s)
4. **pop.mp3** - Soft pop sound (< 0.3s)
5. **notification.mp3** - Subtle notification ping (< 0.5s)
6. **reward.mp3** - Celebration fanfare (1-2s)

## Specifications

- **Format:** MP3 (for browser compatibility)
- **Bitrate:** 128kbps
- **Sample Rate:** 44.1kHz
- **File Size:** < 50KB each (for fast loading)
- **Duration:** As specified above
- **Volume:** Normalized to avoid clipping

## Free Sound Resources

### Recommended Sites

1. **Freesound.org**
   - Creative Commons licensed sounds
   - High quality
   - Free with attribution

2. **Zapsplat.com**
   - Free sound effects
   - No attribution required for standard license
   - Large library

3. **Mixkit.co**
   - Free music & sound effects
   - Commercial use allowed
   - High quality

4. **Pixabay Sounds**
   - Free sound effects
   - No attribution required
   - Royalty-free

### Search Terms

- **success.mp3**: "success chime", "notification bell", "success sound"
- **order-placed.mp3**: "order confirmation", "happy notification", "success tone"
- **coin.mp3**: "coin collect", "coin pickup", "coin sound effect"
- **pop.mp3**: "pop sound", "soft pop", "bubble pop"
- **notification.mp3**: "notification ping", "message tone", "subtle notification"
- **reward.mp3**: "reward fanfare", "success fanfare", "achievement sound"

## Testing

After adding sound files, test them:

1. **Enable sounds** in the app (SoundToggle component)
2. **Test each event:**
   - Place an order → `order-placed.mp3`
   - Add to cart → `pop.mp3`
   - Wallet credit → `coin.mp3`
   - Status update → `notification.mp3`
   - Referral reward → `reward.mp3`

## Optional: Add OGG Format

For better browser compatibility, you can also add OGG versions:

- success.ogg
- order-placed.ogg
- coin.ogg
- pop.ogg
- notification.ogg
- reward.ogg

The SoundManager will automatically fallback to OGG if MP3 is not supported.

## Converting Sounds

Use **FFmpeg** to convert and optimize:

```bash
# Convert to MP3
ffmpeg -i input.wav -acodec libmp3lame -ab 128k success.mp3

# Convert to OGG
ffmpeg -i input.wav -acodec libvorbis -ab 128k success.ogg

# Normalize volume
ffmpeg -i input.mp3 -af "volume=0.8" output.mp3
```

## Current Status

⚠️ **Placeholder files exist** - Replace with actual audio files before production!

---

**Need help?** Check the main animation documentation:  
`ANIMATION_SYSTEM_DOCUMENTATION.md`
