import { ref, computed, onMounted, onUnmounted, watch } from "vue";

export type Route =
  | { view: "index" }
  | { view: "about" }
  | { view: "thesis" }
  | { view: "scenario"; scenarioId: string; step: number };

function parseHash(): Route {
  const hash = location.hash.replace(/^#\/?/, "");
  if (!hash) return { view: "index" };
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "about") return { view: "about" };
  if (parts[0] === "thesis") return { view: "thesis" };
  if (parts[0] === "s" && parts[1]) {
    const step = parts[2] ? parseInt(parts[2], 10) || 0 : 0;
    return { view: "scenario", scenarioId: parts[1], step };
  }
  return { view: "index" };
}

function routeToHash(route: Route): string {
  if (route.view === "index") return "#/";
  if (route.view === "about") return "#/about";
  if (route.view === "thesis") return "#/thesis";
  return `#/s/${route.scenarioId}/${route.step}`;
}

const route = ref<Route>(parseHash());

function sync() {
  route.value = parseHash();
}

let listeners = 0;
function attach() {
  if (listeners === 0) window.addEventListener("hashchange", sync);
  listeners += 1;
}
function detach() {
  listeners -= 1;
  if (listeners === 0) window.removeEventListener("hashchange", sync);
}

export function useRoute() {
  onMounted(attach);
  onUnmounted(detach);

  const navigate = (next: Route) => {
    const target = routeToHash(next);
    if (location.hash === target) return;
    location.hash = target;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  watch(route, () => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  });

  return {
    route: computed(() => route.value),
    navigate,
  };
}
