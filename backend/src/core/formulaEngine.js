class FormulaEngine {
  calculateForm2A(parameters, config) {
    return Object.keys(parameters).reduce((sum, key) => {
      const weight = config.weights[key] || 0;
      return sum + parameters[key] * weight;
    }, 0);
  }

  requiresForm2B(score, threshold) {
    return score < threshold;
  }

  determineStatus(structuralScore, maintenanceScore, thresholds) {
    const structuralFail = structuralScore < thresholds.structural;
    const maintenanceFail = maintenanceScore < thresholds.maintenance;
    if (structuralFail && maintenanceFail) return "STRUCTURAL_AND_MAINTENANCE";
    if (structuralFail) return "STRUCTURAL_EVALUATION";
    if (maintenanceFail) return "MAINTENANCE";
    return "SAFE";
  }
}

module.exports = { FormulaEngine };
