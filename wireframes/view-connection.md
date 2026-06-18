# View Connection — Relationship Home

> Design inspiration: Luma's clean card-based UI, generous whitespace, rounded avatars, and bottom-sheet modals.

---

## Screen: Connection Detail (Scrollable)

```
+----------------------------------------------------------+
|                                                          |
|   < Back                                                 |
|                                                          |
|                                                          |
|                    +------------+                        |
|                    |            |                        |
|                    |   [PHOTO]  |        120x120         |
|                    |            |        rounded-full    |
|                    +------------+                        |
|                                                          |
|                    Sarah Chen                            |
|              Last talked: 2 days ago                     |
|                                                          |
|     +------------------+    +------------------+         |
|     |   📝 Quick Note  |    |   ⚡ Log Event   |         |
|     +------------------+    +------------------+         |
|                                                          |
|  +----------------------------------------------------+  |
|  |  📋 About Them                                     |  |
|  |                                                    |  |
|  |  Currently  Product Designer at Figma              |  |
|  |  Location   San Francisco, CA                      |  |
|  |  Partner    Alex Rodriguez                         |  |
|  |  Birthday   March 15                               |  |
|  |                                                    |  |
|  |  Likes      Sour beer, hiking, Studio Ghibli       |  |
|  |  Dislikes   Cilantro, loud restaurants             |  |
|  |                                                    |  |
|  |  How we met React Conf 2024 (intro'd by Jake)      |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |  🔥 Relationship Vitality                          |  |
|  |                                                    |  |
|  |  [████████░░░░░░░░░░]  Warm — 4 weeks streak!      |  |
|  |                                                    |  |
|  |  You usually catch up every 10-14 days.            |  |
|  |  Longest gap: 6 weeks (Dec 2025).                  |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |  📸 Shared Moments  (2 photos)                     |  |
|  |                                                    |  |
|  |  +--------+  +--------+  +--------+                |  |
|  |  |  🖼️   |  |  🖼️   |  |  + Add |                |  |
|  |  +--------+  +--------+  +--------+                |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |  🕰️  Timeline                                      |  |
|  |                                                    |  |
|  |  ━━━━ Jun 2025 ━━━━                                |  |
|  |                                                    |  |
|  |  ┌───┐                                             |  |
|  |  │ ☕ │  Jun 10    Coffee at Sightglass             |  |
|  |  └───┘            "She's nervous about the         |  |
|  |                    team re-org. Follow up next       |  |
|  |                    week."                            |  |
|  |                    ──────────────────────            |  |
|  |                                                    |  |
|  |  ┌───┐                                             |  |
|  |  │ 💬 │  Jun 05    Text exchange                    |  |
|  |  └───┘            "Shared that article about        |  |
|  |                    design systems"                   |  |
|  |                    ──────────────────────            |  |
|  |                                                    |  |
|  |  ━━━━ May 2025 ━━━━                                |  |
|  |                                                    |  |
|  |  ┌───┐                                             |  |
|  |  │ 🎉 │  May 20    Her birthday dinner              |  |
|  |  └───┘            [🖼️] Got her the hardcover       |  |
|  |                    "The Design of Everyday Things"   |  |
|  |                    ──────────────────────            |  |
|  |                                                    |  |
|  |  ┌───┐                                             |  |
|  |  │ 📞 │  May 08    Phone call                       |  |
|  |  └───┘            "45 min. She's thinking about     |  |
|  |                    moving to NYC next year."         |  |
|  |                    ──────────────────────            |  |
|  |                                                    |  |
|  |  ┌───┐                                             |  |
|  |  │ 🎁 │  May 01    Gift idea (saved)                |  |
|  |  └───┘            "Mentioned wanting a new          |  |
|  |                    camera lens — Sony 35mm f/1.8"    |  |
|  |                    ──────────────────────            |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|                                                          |
|  +----------------------------------------------------+  |
|  |  🗑️  Danger Zone                                   |  |
|  |                                                    |  |
|  |  [Hold to delete this connection...]               |  |
|  |  (press and hold for 1.5 seconds)                  |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

---

## Bottom Sheet: Log Event

```
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+    |
|  |                                                  |    |
|  |          ────────  Drag handle  ────────         |    |
|  |                                                  |    |
|  |  Log an interaction with Sarah                   |    |
|  |                                                  |    |
|  |  What happened?                                  |    |
|  |                                                  |    |
|  |  +------+  +------+  +------+  +------+          |    |
|  |  |  ☕  |  |  📞  |  |  💬  |  |  🎉  |          |    |
|  |  |Coffee|  | Call |  | Text |  |Event |          |    |
|  |  +------+  +------+  +------+  +------+          |    |
|  |                                                  |    |
|  |  +------+  +------+  +------+                   |    |
|  |  |  🍽️  |  |  🎁  |  |  📝  |                   |    |
|  |  |Dinner|  | Gift |  | Note |                   |    |
|  |  +------+  +------+  +------+                   |    |
|  |                                                  |    |
|  |  Details                                         |    |
|  |  +--------------------------------------------+  |    |
|  |  | Had coffee at Sightglass in SoMa. She      |  |    |
|  |  | mentioned the re-org...                    |  |    |
|  |  +--------------------------------------------+  |    |
|  |                                                  |    |
|  |  [📎 Attach photo]                               |    |
|  |                                                  |    |
|  |         +--------------------+                   |    |
|  |         |   Save Event       |                   |    |
|  |         +--------------------+                   |    |
|  |                                                  |    |
|  +--------------------------------------------------+    |
|                                                          |
+----------------------------------------------------------+
```

---

## Bottom Sheet: Quick Note

```
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+    |
|  |                                                  |    |
|  |          ────────  Drag handle  ────────         |    |
|  |                                                  |    |
|  |  Quick note about Sarah                          |    |
|  |                                                  |    |
|  |  +--------------------------------------------+  |    |
|  |  | She mentioned wanting a new camera lens    |  |    |
|  |  | — Sony 35mm f/1.8                          |  |    |
|  |  |                                            |  |    |
|  |  |                                            |  |    |
|  |  +--------------------------------------------+  |    |
|  |                                                  |    |
|  |  Auto-saved to: 🎁 Gift Ideas                  |    |
|  |  (type: Note · tagged as gift-idea)            |    |
|  |                                                  |    |
|  |         +--------------------+                   |    |
|  |         |   Save Note        |                   |    |
|  |         +--------------------+                   |    |
|  |                                                  |    |
|  +--------------------------------------------------+    |
|                                                          |
+----------------------------------------------------------+
```

---

## Bottom Sheet: Edit About Them

```
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+    |
|  |                                                  |    |
|  |          ────────  Drag handle  ────────         |    |
|  |                                                  |    |
|  |  About Sarah                                     |    |
|  |                                                  |    |
|  |  Job              [Product Designer     ]        |    |
|  |  Company          [Figma                 ]        |    |
|  |  Location         [San Francisco, CA     ]        |    |
|  |  Partner          [Alex Rodriguez        ]        |    |
|  |  Birthday         [March 15              ]        |    |
|  |                                                  |    |
|  |  Likes            [sour beer, hiking     ]        |    |
|  |  Dislikes         [cilantro              ]        |    |
|  |  How we met       [React Conf 2024       ]        |    |
|  |                                                  |    |
|  |         +--------------------+                   |    |
|  |         |   Save Changes     |                   |    |
|  |         +--------------------+                   |    |
|  |                                                  |    |
|  +--------------------------------------------------+    |
|                                                          |
+----------------------------------------------------------+
```

---

## Interaction: Hold to Delete

```
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  |  🗑️  Danger Zone                                   |  |
|  |                                                    |  |
|  |  [Hold to delete this connection...]               |  |
|  |                                                    |  |
|  |  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  0%              |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|  (User holds finger down...)
|                                                          |
|  +----------------------------------------------------+  |
|  |  🗑️  Danger Zone                                   |  |
|  |                                                    |  |
|  |  [Hold to delete this connection...]               |  |
|  |                                                    |  |
|  |  ████████████████████████████████  100%            |  |
|  |                                                    |  |
|  +----------------------------------------------------+  |
|                                                          |
|  +----------------------------------------------------+  |
|  |  ⚠️  Delete Sarah Chen?                            |  |
|  |                                                    |  |
|  |  This will remove all notes, photos, and tags.     |  |
|  |  This cannot be undone.                            |  |
|  |                                                    |  |
|  |  [      Cancel      ]  [    Delete    ]            |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

---

## Principles

1. **Luma-inspired**: Big avatars, generous whitespace, soft rounded corners, muted borders, card-based sections.
2. **Relationship-first**: The page tells the *story* of you two, not just stores data.
3. **Frictionless capture**: Two-tap quick actions (note / event) via bottom sheets so you never lose a thought.
4. **Contextual cheat sheet**: "About Them" is the thing you skim before meeting up.
5. **Destructive safety**: Hold-to-delete with progress bar + confirmation dialog prevents accidents.
6. **Visual timeline**: Icons + dates + content cards make history scannable and emotional.
