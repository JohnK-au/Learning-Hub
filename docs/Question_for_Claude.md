# List of questions for Claude after the flight

I would like Claude to answer the questions here, storing the answer to each question just below its associated question.

1. When there is an export prior to function ..., what is the export doing?

2. I am a bit confused about how these functions work, like nextLessonInTrack. Can you walk through how it works and how it flows through the code?

3. Why does track.id work when the only variable in the function was track: Track?

4. I'm confused how this works:

): Lesson | null {
const completed = new Set(
progress.tracks[track.id]?.completedLessonIds ?? [],
);

5. How am I supposed to know when it is track.modules or modules.lessons?
