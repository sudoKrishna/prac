export async function get_current_time() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2 ,"0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
     
    return `${hours}:${minute}:${seconds}`
    
}

export async function calculator(
  a: number,
  b: number,
  operation: "add" | "subtract" | "multiply" | "divide"
) {
  switch (operation) {
    case "add":
      return `Result: ${a + b}`;
    case "subtract":
      return `Result: ${a - b}`;
    case "multiply":
      return `Result: ${a * b}`;
    case "divide":
      if (b === 0) {
        return `Error: cannot divide by zero`;
      }
      return `Result: ${a / b}`;
    default:
      return `Error: unknown operation "${operation}"`;
  }
}