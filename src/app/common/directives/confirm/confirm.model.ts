export class ConfirmInfoModel {
  constructor(
    public readonly title: string,
    public readonly question: string,
    public readonly width: string = '250px'
  ) {}
}
