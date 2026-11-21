# EduBuddy local accounts

The authentication feature keeps a versioned account registry at `edubuddy_auth_v1`. Account records include a salt and PBKDF2-SHA-256 password hash; plaintext passwords are never persisted. The active account ID is stored in the same versioned registry so a reload restores the matching student or teacher workspace.

## Local MVP boundaries

- Accounts and login sessions exist only in this browser profile. They do not authenticate with the Express server, synchronize across devices, or provide account recovery.
- A client-side password hash does not make local authentication production-secure. Browser storage is accessible to code running in the same origin; use a trusted origin, HTTPS, a server-issued session, and server-side password hashing before deployment for real accounts.
- Student learning history, saved resources, XP, exams and other legacy feature records remain in their existing localStorage keys. Only the active student's profile is synchronized to the legacy `edubuddy-v1` store; other feature records are still shared on this browser between local accounts.
- When no local accounts exist, the first student signup can adopt the existing student profile's class, board, subjects and learning preference. Existing history and gamification data are retained. The teacher dashboard continues to use its independent `edubuddy_teacher_dashboard_v1` demo workspace and is not connected to student accounts or teacher classrooms across devices.

The account registry is kept separate from `edubuddy-v1`; signing in, signing out or registering never clears that legacy store or any feature-specific storage key.
