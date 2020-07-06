interface UseScrollNavigationProps {
  scrollableContainer?: EventTarget;
  scrollableTargets: HTMLElement[];
  offsetTop?: number;
}

interface ScrollToOptions {
  behavior: ScrollBehavior;
}

interface UseScrollNavigationState {
  hitTargetIndex: number;
  scrollTo: (targetIndex: number, options?: ScrollToOptions) => void;
}
