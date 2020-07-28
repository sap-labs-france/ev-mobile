
export default class MigrationManager {
  private static instance: MigrationManager;

  private constructor() {
  }

  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  public migrate = async () => {
  }
}
