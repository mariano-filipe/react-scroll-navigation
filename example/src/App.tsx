import React, { useRef } from "react";
import { AppBar, Tabs, Tab, Typography, makeStyles, Paper } from "@material-ui/core";

import { useScrollNavigation } from "../../use-scroll-navigation/dist";

interface ExampleSection {
  id: number;
  name: string;
  items: Array<{ id: number; name: string }>;
}

const NSECTIONS = 10;
const NITEMS = 5;
const getSections = (): ExampleSection[] => {
  return [...Array(NSECTIONS).keys()].map((sectionIndex) => ({
    id: sectionIndex,
    name: `Session ${sectionIndex}`,
    items: [...Array(NITEMS).keys()].map((itemIndex) => ({
      id: itemIndex,
      name: `Item ${itemIndex}`,
    })),
  }));
};

const APPBAR_HEIGHT = 48;
const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(1, 2),
  },
  appBarSpacer: {
    minHeight: APPBAR_HEIGHT,
  },
  section: {
    margin: theme.spacing(2),
  },
  sectionItem: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1),
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const sections = getSections();
  const sectionRefs = useRef<HTMLElement[]>([]);
  const { hitTargetIndex, scrollTo } = useScrollNavigation({
    scrollableTargets: sectionRefs.current,
    offsetTop: APPBAR_HEIGHT,
  });

  const onTabIndexChange = (event: React.ChangeEvent<{}>, newTabIndex: number): void => {
    scrollTo(newTabIndex, { behavior: "smooth" });
  };

  const onSectionRef = (sectionIndex: number, sectionElement: HTMLElement | null): void => {
    if (sectionElement) {
      sectionRefs.current[sectionIndex] = sectionElement;
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Tabs variant="scrollable" value={hitTargetIndex} onChange={onTabIndexChange}>
          {sections.map((section) => (
            <Tab key={section.id} label={section.name} />
          ))}
        </Tabs>
      </AppBar>
      <div className={classes.appBarSpacer} />
      <main className={classes.main}>
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={classes.section}
            ref={(element): void => onSectionRef(sectionIndex, element)}
          >
            <Typography variant="h4">{section.name}</Typography>
            {section.items.map((item) => (
              <Paper key={item.id} elevation={3} className={classes.sectionItem}>
                <Typography variant="body1">{item.name}</Typography>
              </Paper>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;
