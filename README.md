# AutofillKeyboard

A custom iOS keyboard extension that reads form field labels in **Arabic and English** and suggests stored autofill values with a single tap. Works in any app or web form — no `textContentType` required from the developer.

---

## Features

- Multiple **person profiles** (e.g. "Ahmad", "My Father", "Sara")
- Standard fields: name, email, phone, address, username, password, national ID, passport number, credit card
- **Custom fields** — add any field with any label (e.g. "Employee ID", "رقم رخصة القيادة")
- **Arabic + English** label detection from surrounding form text
- Profile switcher chip in the suggestion bar — switch profiles without leaving the app
- Works in native apps, Safari, and any WKWebView app

---

## Project Structure

```
Shared/                     — Added to BOTH targets
  AutofillProfile.swift     — Data model
  ProfileStore.swift        — Profile list management
  SharedDefaults.swift      — App Groups UserDefaults wrapper

ContainerApp/               — iOS container app (manage profiles)
  AppDelegate.swift
  SceneDelegate.swift
  ProfileListViewController.swift
  ProfileEditViewController.swift
  StandardFieldCell.swift
  CustomFieldCell.swift
  Info.plist
  AutofillKeyboard.entitlements

KeyboardExtension/          — Custom keyboard extension
  KeyboardViewController.swift
  SuggestionsBar.swift
  AutofillProvider.swift
  LabelDetector.swift
  KeywordDictionary.swift
  KeyboardView.swift
  KeyboardKey.swift
  Info.plist
  KeyboardExtension.entitlements
```

---

## Xcode Setup (Required)

The Swift sources are ready. You need to wire them into an Xcode project:

### 1. Prerequisites
- Xcode 15 or later
- Apple Developer account (free works on Simulator; paid account needed for device side-loading with App Groups)

### 2. Create the Xcode project

1. Open Xcode → **File › New › Project › iOS › App**
   - Product Name: `AutofillKeyboard`
   - Bundle Identifier: `com.yourorg.AutofillKeyboard` *(replace `yourorg`)*
   - Interface: **Storyboard** → you can delete `Main.storyboard`; the app uses code-only UI

2. **File › New › Target › Custom Keyboard Extension**
   - Product Name: `KeyboardExtension`
   - Bundle Identifier will be set to `com.yourorg.AutofillKeyboard.KeyboardExtension` automatically

3. Delete the auto-generated `KeyboardViewController.swift` Xcode created — our version is already in `KeyboardExtension/`.

### 3. Add source files to the project

Drag the three folders into the Xcode Project Navigator:

| Folder | Add to targets |
|--------|---------------|
| `Shared/` | AutofillKeyboard + KeyboardExtension |
| `ContainerApp/` | AutofillKeyboard only |
| `KeyboardExtension/` | KeyboardExtension only |

In the "Choose options for adding files" dialog, **uncheck "Copy items if needed"** (files are already in the repo).

### 4. Configure Bundle IDs

Replace every occurrence of `com.yourorg` with your own reverse-domain prefix in:
- `ContainerApp/Info.plist`
- `ContainerApp/AutofillKeyboard.entitlements`
- `KeyboardExtension/Info.plist`
- `KeyboardExtension/KeyboardExtension.entitlements`
- `Shared/SharedDefaults.swift` (the `suiteName` constant)

All five places must use the **exact same App Group string**, e.g. `group.com.yourorg.AutofillKeyboard`.

### 5. Configure App Groups

**In developer.apple.com › Certificates, Identifiers & Profiles:**

1. Register App ID `com.yourorg.AutofillKeyboard` with **App Groups** capability
2. Register App ID `com.yourorg.AutofillKeyboard.KeyboardExtension` with **App Groups** capability
3. Create App Group `group.com.yourorg.AutofillKeyboard` and associate it with both App IDs

**In Xcode, for each target:**

1. Select target → **Signing & Capabilities** → **+ Capability** → **App Groups**
2. Add group `group.com.yourorg.AutofillKeyboard`

### 6. Build settings for KeyboardExtension target

In **Build Settings**, set:

| Setting | Value |
|---------|-------|
| `APPLICATION_EXTENSION_API_ONLY` | `YES` |
| `PRODUCT_BUNDLE_IDENTIFIER` | `com.yourorg.AutofillKeyboard.KeyboardExtension` |
| `INFOPLIST_FILE` | `KeyboardExtension/Info.plist` |
| `CODE_SIGN_ENTITLEMENTS` | `KeyboardExtension/KeyboardExtension.entitlements` |
| `IPHONEOS_DEPLOYMENT_TARGET` | `16.0` |
| `SWIFT_VERSION` | `5.9` |

### 7. Build and run

Select the **AutofillKeyboard** scheme and run on a Simulator or device.

---

## Enabling the Keyboard

1. On device/Simulator: **Settings › General › Keyboard › Keyboards › Add New Keyboard**
2. Scroll to **AutofillKeyboard** and tap it
3. Tap **AutofillKeyboard** in the keyboard list and enable **Allow Full Access**
   *(Required so the keyboard can read your saved profiles)*

---

## Usage

### Add a profile
1. Open the **AutofillKeyboard** app
2. Tap **+** to create a profile — give it a person's name (e.g. "Ahmad" or "My Father")
3. Fill in standard fields and/or tap **Add Custom Field** for any extra field
4. Tap **Save**, then **Set as Active Profile**

### Use the keyboard
1. Open any app (Safari, native forms, etc.) and tap a text field
2. Long-press the globe key on any keyboard to switch to AutofillKeyboard
3. The suggestion bar shows chips based on the field's label text
4. Tap a chip to insert the value
5. Tap the profile button (top right of suggestion bar) to switch between profiles

### How field detection works
The keyboard reads the text that appears **just before the cursor** — usually the field's label — and matches it against a built-in dictionary of Arabic and English keywords. This works even in apps that never set `textContentType`.

**Example:** If the form shows `البريد الإلكتروني` before the cursor, the email chip appears automatically.

Custom fields are also matched: if you saved a field named "Passport Number" and the form label contains those words, that chip appears.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No suggestions appear | Make sure "Allow Full Access" is on in Settings |
| Wrong suggestion shown | The form may not have a recognizable label — check the field label language |
| Profiles not syncing | Verify the App Group identifier is identical in all 5 places |
| Extension crashes on launch | Check `NSExtensionPrincipalClass` in `KeyboardExtension/Info.plist` matches `KeyboardExtension.KeyboardViewController` |
