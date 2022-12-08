export class TaskDto {
  constructor(
    public id: number,
    public name: string,
    public user_id: number,
    public status: "ASSIGNED" | "COMPLETED"
  ) {}
}
