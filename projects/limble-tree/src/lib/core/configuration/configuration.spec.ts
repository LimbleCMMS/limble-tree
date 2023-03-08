import { EmptyComponent } from "../../test-util/empty.component";
import { getViewContainer } from "../../test-util/virtual";
import { TreeRoot } from "../tree-root/tree-root";
import { config } from "./configuration";

describe("config (singleton instance of Configuration)", () => {
   it("should return undefined when getting a config that has not been set", () => {
      expect(
         config.getConfig(new TreeRoot<EmptyComponent>(getViewContainer()))
      ).toBeUndefined();
   });

   it("should allow a new configuration to be set, and be able to retrieve that configuration", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const options = {};
      config.setConfig(root, options);
      expect(config.getConfig(root)).toBe(options);
   });

   it("should allow a configuration to be deleted", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const options = {};
      config.setConfig(root, options);
      expect(config.getConfig(root)).toBe(options);
      config.delete(root);
      expect(config.getConfig(root)).toBeUndefined();
   });

   it("should allow a configuration to be overwritten", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const options1 = {};
      const options2 = {};
      config.setConfig(root, options1);
      expect(config.getConfig(root)).toBe(options1);
      config.setConfig(root, options2);
      expect(config.getConfig(root)).toBe(options2);
   });
});
