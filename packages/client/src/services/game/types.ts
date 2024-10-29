export type TCoordinates = {
    x: number;
    y: number;
};
export interface IPlayer {
    coordinates: TCoordinates;
    height: number;
    width: number;
    speed: number;
    setCoordinate(x: number, y: number): void;
    move(xSpeed: number): void;
    jump(ySpeed: number): void;
}
export type TPlayerOptions = {
    coordinates: TCoordinates;
    height: number;
    width: number;
    speed: number;
};
export interface IMapObject {
    x: number;
    y: number;
    height: number;
    width: number;
    type: ObjectTypes;
    // color: string;
    // image: string;
    _id: string;
}
export interface IMap {
    height: number;
    width: number;
    objects: IMapObject[];
    addObject(mapObject: IMapObject): void;
    removeObjects(ids: string[]): void;
}
export type TMapOptions = {
    height: number;
    width: number;
};
export enum ObjectTypes {
    Platform = "#",
    Coin = "c",
    Start = "s",
    End = "e",
    Water = "w",
    Empty = " ",
}
