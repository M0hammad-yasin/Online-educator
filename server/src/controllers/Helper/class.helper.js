export function generateClassId(grade, subject) {
  function getSubjectPrefix(subject) {
    const lowerSubject = subject.toLowerCase();

    if (lowerSubject.includes("math")) {
      return "Math";
    }
    if (lowerSubject.includes("sci")) {
      return "SCI";
    }
    if (lowerSubject.includes("phy")) {
      return "Phy";
    }
    if (lowerSubject.includes("bio")) {
      return "Bio";
    }
    if (lowerSubject.includes("che")) {
      return "Che";
    }
    if (lowerSubject.includes("eng")) {
      return "Eng";
    }
    if (lowerSubject.includes("urdu")) {
      return "Urdu";
    }
    if (lowerSubject.includes("computer")) {
      return "CS";
    }

    // Fallback: return the subject capitalized (or any default behavior)
    return subject.charAt(0).toUpperCase() + subject.slice(3);
  }
  function getOrdinal(n) {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) {
      return n + "st";
    }
    if (j === 2 && k !== 12) {
      return n + "nd";
    }
    if (j === 3 && k !== 13) {
      return n + "rd";
    }
    return n + "th";
  }
  const key = subject.toLowerCase();
  const prefix = getSubjectPrefix(key);
  const ordinalGrade = getOrdinal(grade);
  return `#${prefix}-${ordinalGrade}`;
}
export function getDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
}
