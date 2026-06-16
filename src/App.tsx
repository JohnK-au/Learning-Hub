import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.tsx";
import Home from "@/pages/Home.tsx";
import Topics from "@/pages/Topics.tsx";
import Stats from "@/pages/Stats.tsx";
import NotFound from "@/pages/NotFound.tsx";

/**
 * Route table. Layout renders the shell; nested routes render into its Outlet.
 * New pages plug in here as the app grows (TopicDetail, SessionPlayer, Onboarding).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="topics" element={<Topics />} />
        <Route path="stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
