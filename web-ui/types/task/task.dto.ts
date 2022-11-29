export class TaskDto {
  constructor(
    public id: number,
    public name: string,
    public userId: number,
    public status: "ASSIGNED" | "COMPLETED"
  ) {}
}
