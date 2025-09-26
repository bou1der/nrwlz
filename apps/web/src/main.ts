import { bootstrapApplication } from '@angular/platform-browser';
import { Config } from './app/root.config';
import { Root } from './app/root';

bootstrapApplication(Root, Config).catch((err) =>
  console.error(err)
);
