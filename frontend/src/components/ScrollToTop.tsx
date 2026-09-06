import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation, and browsers
// restore the previous scroll offset on refresh — combined with the sticky
// Navbar, that made pages look like they opened mid-page instead of at top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
