export const REACTIONS = [
  "like",
  "heart",
  "haha",
  "wow",
  "sad",
  "angry",
]

export const REACTION_EMOJIS = {
  heart: "❤️",
  like: "👍",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
  USER: "USER",
} as const;

export const PRICE_OF = {
  REACTIONS: "REACTIONS",
  VIEWS: "VIEWS"
} as const