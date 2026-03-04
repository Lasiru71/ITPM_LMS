
import cron from "node-cron";

cron.schedule("0 8 * * *",()=>{
 console.log("Checking attendance warnings...");
});
