export class NotificationModel {
  constructor(
    public readonly message: string,
    public readonly iconName: string,
    public readonly showProgress: boolean
  ) {}
}
