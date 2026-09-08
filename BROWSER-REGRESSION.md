# Browser regression evidence

Chrome loaded `dist/` on `https://github.com/torvalds`. Play -> Close restored Play; clicking it reopened the game. Play -> Close -> reload -> Play also passed, with `gol-controls` and `Generation: 0` visible in the accessibility tree.
