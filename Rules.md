These rules serve as a guiding philosophy for building the Onda MVP, ensuring we stay on track, on budget, and focused on learning.

1. The "Invisible" Rule
Prioritize a seamless, sound-based user experience. The app should be used with eyes closed. Avoid creating a visual UI that requires the user's attention. If a visual component is absolutely necessary, it should be subtle and ambient.

2. The "Budget-First" Rule
All technical decisions for the MVP must prioritize zero ongoing costs.

Default to browser APIs: Prefer the Web Audio API and Web Speech API over cloud services.

Embrace static assets: Use pre-generated audio files instead of real-time generative AI.

Avoid data storage: The MVP is stateless. No user data, no databases.

3. The "Keep it Simple" Rule
Adhere strictly to the TASKS.md document. The MVP's scope is narrow by design. Do not add features that fall outside the defined plan, such as a "Distort" mode or a visualizer. Finish the current phase before moving to the next.

4. The "Learning-First" Rule
Treat the AI as a co-pilot, not a replacement.

Don't just copy and paste. Understand every line of code.

Ask "why": When the AI provides a solution, ask for an explanation of the underlying concepts.

Document your progress: Use Git commits to mark the completion of each small task, creating a clear history of your learning journey.