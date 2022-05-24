# Notes

## May 22, 2022

- Removed most boiler plate code from [[main.ts]]
- Installed Hot Reload Plugin
- Updated manifest file
- Wrote pseudo code for app with checks

- Tried to look up how to read the files from the system but there's no real Obsidian API documentation which is ass.
- Nvm lol it's under [advanced docs](https://marcus.se.net/obsidian-plugin-docs/api/classes/Vault)

## May 23, 2022

- File writing done through modify command
- Updated the reset files to not delete
- Setup checkCommand instead of just addCommand

- Date and time issues with ISO String being UTC
- Subtract 7 hours to get PST
- Just handling move tasks to completed
- Not picking up children
  - They were tab indented not space so now I check for both
- Not able to run more than once without resetting?
  - I was regenerating # Complete not # Completed T_T

## May 24, 2022

- Doesn't move last line item?
  - I think it's just a timing thing. The file hasn't updated fast enough if I execute too soon
- White space is also adding up and not getting removed before Completed.
  - Working now
- Command also extracts complete tasks from Log
- functionize completion identification
- Reassemble pieces

## Issues


