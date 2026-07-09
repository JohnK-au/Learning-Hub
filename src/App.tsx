import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.tsx";
import Home from "@/pages/Home.tsx";
import Topics from "@/pages/Topics.tsx";
import TopicDetail from "@/pages/TopicDetail.tsx";
import SessionPlayer from "@/pages/SessionPlayer.tsx";
import Stats from "@/pages/Stats.tsx";
import Onboarding from "@/pages/Onboarding.tsx";
import NotFound from "@/pages/NotFound.tsx";

/**
 * Route table. Layout renders the shell; nested routes render into its Outlet.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="topics" element={<Topics />} />
        <Route path="topic/:topicId" element={<TopicDetail />} />
        <Route path="learn/:trackId" element={<SessionPlayer />} />
        <Route path="stats" element={<Stats />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
