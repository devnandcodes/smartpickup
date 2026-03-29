export function formatDate(dateString: string | null): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatScore(home: number, away: number): string {
  return `${home} - ${away}`;
}

export function formatMatchStatus(status: string): string {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "live":
      return "LIVE";
    case "halftime":
      return "Half Time";
    case "finished":
      return "Full Time";
    default:
      return status;
  }
}
