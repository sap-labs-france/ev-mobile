export class PricedConsumption {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public readonly amount: number,
    public readonly cumulatedAmount: number,
    public readonly roundedAmount: number,
    public readonly currencyCode: string,
    public readonly pricingSource: string
  ) {}
}
