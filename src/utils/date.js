export function getDateTimeBR() {
  const now = new Date();

  const date = now.toLocaleDateString("pt-BR");
  const time = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    display: `${date} ${time}`,

    filename: `${date.replace(/\//g, "-")}_${time.replace(/:/g, "h")}`,
  };
}
