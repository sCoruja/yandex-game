import {
    IPlayer,
    TCoordinates,
    TPlayerOptions,
    IMapObject,
    ObjectTypes,
    IMap,
    TMapOptions,
} from "./types";
import { v4 as uuidv4 } from "uuid";
const OBJECT_COLORS = {
    [ObjectTypes.Platform]: "#645c5b",
    [ObjectTypes.Coin]: "#ffd800",
    [ObjectTypes.Start]: "#bae2e5",
    [ObjectTypes.Water]: "#494ee9",
    [ObjectTypes.End]: "#bae6c1",
    [ObjectTypes.Empty]: "#ffffff",
};
export class Map implements IMap {
    height: number;
    width: number;
    objects: IMapObject[] = [];
    addObject(mapObject: IMapObject): void {
        this.objects.push(mapObject);
    }
    removeObjects(ids: string[]): void {
        this.objects = this.objects.filter(
            (mapObject) => !ids.includes(mapObject._id),
        );
    }
    constructor(options: TMapOptions) {
        this.height = options.height;
        this.width = options.width;
    }
}
export class Player implements IPlayer {
    coordinates: TCoordinates;
    height: number;
    width: number;
    speed: number;
    constructor(options: TPlayerOptions) {
        this.coordinates = options.coordinates;
        this.height = options.height;
        this.width = options.width;
        this.speed = options.speed;
    }
    setCoordinate(x: number, y: number) {
        this.coordinates.x = x;
        this.coordinates.y = y;
    }
    move(xSpeed: number) {
        this.coordinates.x += xSpeed;
    }
    jump(ySpeed: number) {
        this.coordinates.y -= ySpeed;
    }
}
export class Game {
    private context: CanvasRenderingContext2D;
    private map: IMap | null;
    private player?: IPlayer;
    private _objectForRemoving: string[] = [];
    _blockSize = 32;
    private _jumpHeight = 0;
    private _score = 0;
    private _xSpeed = 0;
    private _ySpeed = 0;
    private _isMoving = false;
    private _isJumping = false;
    private _isFalling = false;
    constructor(context: CanvasRenderingContext2D, map: string) {
        this.context = context;
        this.map = this._generateMap(map);
        this._parseMap(map);
    }
    rendercanvas() {
        this.context.fillStyle = "#F0F8FF";
        this.context.fillRect(0, 0, 40 * this._blockSize, 20 * this._blockSize);
    }
    _generateMap(stringMap: string): IMap | null {
        const rows = stringMap.split("\n");
        const height = rows.length * this._blockSize + 2 * this._blockSize;
        const width =
            rows[0].split("").length * this._blockSize + 2 * this._blockSize;
        const map = new Map({ height, width });
        map.addObject({
            x: 0,
            y: 0,
            width: width,
            height: this._blockSize,
            type: ObjectTypes.Platform,
            _id: uuidv4(),
        });
        map.addObject({
            x: 0,
            y: 0,
            width: this._blockSize,
            height: height,
            type: ObjectTypes.Platform,
            _id: uuidv4(),
        });
        console.log(width);
        map.addObject({
            x: width - this._blockSize,
            y: 0,
            width: this._blockSize,
            height: height,
            type: ObjectTypes.Platform,
            _id: uuidv4(),
        });
        map.addObject({
            x: 0,
            y: height - this._blockSize,
            width: width,
            height: this._blockSize,
            type: ObjectTypes.Platform,
            _id: uuidv4(),
        });
        return map;
    }
    initPlayer() {
        const start = this.map?.objects.find(
            (obj) => obj.type === ObjectTypes.Start,
        );
        if (start) {
            this.player = new Player({
                coordinates: { x: start?.x, y: start?.y },
                speed: this._blockSize / 4,
                height: this._blockSize,
                width: this._blockSize,
            });
        }
    }
    renderplayer() {
        if (this.player) {
            this.context.fillStyle = "red";
            this.context.fillRect(
                this.player.coordinates.x,
                this.player.coordinates.y,
                this.player.width,
                this.player.height,
            );
        }
    }
    _parseMap(texpMap: string) {
        const map: {
            x: number;
            y: number;
            type: ObjectTypes;
        }[][] = texpMap.split("\n").map((row, yIndex) =>
            row
                .split("")
                .map((cell, xIndex) => ({
                    x: xIndex + 1,
                    y: yIndex + 1,
                    type: cell as ObjectTypes,
                }))
                .filter((cell) => cell.type !== ObjectTypes.Empty),
        );
        map.forEach((row) => {
            let tempX = 0;
            let tempLength = 0;
            let tempType: ObjectTypes = ObjectTypes.Empty;
            row.forEach((cell, index) => {
                if (
                    ![ObjectTypes.Platform, ObjectTypes.Water].includes(
                        cell.type,
                    )
                ) {
                    this.map?.addObject({
                        x: cell.x * this._blockSize,
                        y: cell.y * this._blockSize,
                        width: 1 * this._blockSize,
                        height: this._blockSize,
                        type: cell.type,
                        _id: uuidv4(),
                    });
                } else {
                    if (!tempType) {
                        tempX = cell.x;
                        tempLength = 1;
                        tempType = cell.type;
                    } else if (!row[index + 1]) {
                        this.map?.addObject({
                            x: tempX * this._blockSize,
                            y: cell.y * this._blockSize,
                            width: (tempLength + 1) * this._blockSize,
                            height: this._blockSize,
                            type: tempType,
                            _id: uuidv4(),
                        });
                        tempX = 0;
                        tempLength = 0;
                        tempType = ObjectTypes.Empty;
                    } else if (tempType === cell.type) {
                        if (index > 0 && cell.x === row[index - 1].x + 1)
                            tempLength++;
                        else {
                            this.map?.addObject({
                                x: tempX * this._blockSize,
                                y: cell.y * this._blockSize,
                                width: tempLength * this._blockSize,
                                height: this._blockSize,
                                type: tempType,
                                _id: uuidv4(),
                            });
                            tempX = cell.x;
                            tempLength = 1;
                            tempType = cell.type;
                        }
                    } else {
                        this.map?.addObject({
                            x: tempX * this._blockSize,
                            y: cell.y * this._blockSize,
                            width: tempLength * this._blockSize,
                            height: this._blockSize,
                            type: tempType,
                            _id: uuidv4(),
                        });
                        tempX = cell.x;
                        tempLength = 1;
                        tempType = cell.type;
                    }
                }
            });
        });
    }
    renderMap() {
        if (this.map) {
            this.context.fillStyle = "#F0F8FF";
            this.context.fillRect(
                0,
                0,
                this._blockSize * 40,
                this._blockSize * 20,
            );
            this.map.objects.forEach((mapObject) => {
                this.context.fillStyle = OBJECT_COLORS[mapObject.type];
                this.context.fillRect(
                    mapObject.x,
                    mapObject.y,
                    mapObject.width,
                    mapObject.height,
                );
            });
        }
    }
    renderText() {
        this.context.fillStyle = "red";
        this.context.font = "bold 30pt Arial";
        this.context.fillText(`Score: ${this._score}`, 40, 70);
    }
    moveKeyDownHandler(direction: "left" | "right") {
        if (this.player)
            this._xSpeed =
                direction === "left" ? -this.player?.speed : this.player?.speed;
        this._isMoving = true;
    }
    moveKeyUpHandler() {
        this._xSpeed = 0;
        this._isMoving = false;
    }
    jumpKeyDownHandler() {
        if (!this.player || this._isFalling) return;
        if (!this._isJumping) this._ySpeed = this.player?.speed * 1.8;
        this._isJumping = true;
    }
    jumpKeyUpHandler() {
        this._ySpeed = 0;
    }
    move(direction: "left" | "right") {
        if (this.player)
            if (direction === "left")
                this.player.coordinates.x =
                    this.player.coordinates.x - this.player.speed;
            else if (direction === "right")
                this.player.coordinates.x =
                    this.player.coordinates.x + this.player.speed;
    }
    checkIntersection(mapObject: IMapObject) {
        if (!this.player) return;
        if (
            this.player.coordinates.x + this.player.width > mapObject.x &&
            this.player.coordinates.x + this.player.width <
                mapObject.x + mapObject.width &&
            ((this.player.coordinates.y >= mapObject.y &&
                this.player.coordinates.y < mapObject.y + mapObject.height) ||
                (this.player.coordinates.y + this.player.height > mapObject.y &&
                    this.player.coordinates.y + this.player.height <=
                        mapObject.y + mapObject.height))
        ) {
            this.handleRigthIntersection(mapObject);
        }
        if (
            this.player.coordinates.x < mapObject.x + mapObject.width &&
            this.player.coordinates.x > mapObject.x &&
            ((this.player.coordinates.y >= mapObject.y &&
                this.player.coordinates.y < mapObject.y + mapObject.height) ||
                (this.player.coordinates.y + this.player.height > mapObject.y &&
                    this.player.coordinates.y + this.player.height <=
                        mapObject.y + mapObject.height))
        )
            this.handleLeftIntersection(mapObject);
        if (
            this.player.coordinates.y + this.player.height > mapObject.y &&
            this.player.coordinates.y + this.player.height <
                mapObject.y + mapObject.height &&
            this.player.coordinates.x + this.player.width > mapObject.x &&
            this.player.coordinates.x < mapObject.x + mapObject.width
        ) {
            this.handleBottomIntersection(mapObject);
        }

        if (
            this.player.coordinates.y < mapObject.y + mapObject.height &&
            this.player.coordinates.y > mapObject.y &&
            this.player.coordinates.x + this.player.width > mapObject.x &&
            this.player.coordinates.x < mapObject.x + mapObject.width
        )
            this.handleTopIntersection(mapObject);
    }
    checkFalling(mapObject: IMapObject) {
        if (
            this.player &&
            this.player.coordinates.y + this.player.height === mapObject.y &&
            this.player.coordinates.x + this.player.width > mapObject.x &&
            this.player.coordinates.x < mapObject.x + mapObject.width
        ) {
            return false;
        }
        return true;
    }
    handleBottomIntersection(mapObject: IMapObject) {
        if (mapObject.type === ObjectTypes.Platform) {
            console.log("bottom intersection");
            this._ySpeed = 0;
            this._isJumping = false;
            this._isFalling = false;
            this._jumpHeight = 0;
            this.player?.setCoordinate(
                this.player.coordinates.x,
                mapObject.y - this.player.height + this._ySpeed,
            );
        } else if (mapObject.type === ObjectTypes.Coin) {
            if (!this._objectForRemoving.includes(mapObject._id)) {
                this._score++;
                this._objectForRemoving.push(mapObject._id);
            }
        }
    }
    handleTopIntersection(mapObject: IMapObject) {
        if (mapObject.type === ObjectTypes.Platform) {
            this.player?.setCoordinate(
                this.player.coordinates.x,
                mapObject.y + mapObject.height,
            );
        } else if (mapObject.type === ObjectTypes.Coin) {
            if (!this._objectForRemoving.includes(mapObject._id)) {
                this._score++;
                this._objectForRemoving.push(mapObject._id);
            }
        }
    }
    handleLeftIntersection(mapObject: IMapObject) {
        console.log("left");
        if (mapObject.type === ObjectTypes.Platform)
            this.player?.setCoordinate(
                this.player.coordinates.x - this._xSpeed,
                this.player.coordinates.y,
            );
        else if (mapObject.type === ObjectTypes.Coin) {
            if (!this._objectForRemoving.includes(mapObject._id)) {
                this._score++;
                this._objectForRemoving.push(mapObject._id);
            }
        }
    }
    handleRigthIntersection(mapObject: IMapObject) {
        if (mapObject.type === ObjectTypes.Platform)
            this.player?.setCoordinate(
                this.player.coordinates.x - this._xSpeed,
                this.player.coordinates.y,
            );
        else if (mapObject.type === ObjectTypes.Coin) {
            if (!this._objectForRemoving.includes(mapObject._id)) {
                this._score++;
                this._objectForRemoving.push(mapObject._id);
            }
        }
    }
    loop() {
        setInterval(() => {
            this.renderMap();
            if (this.player) {
                this._isMoving && this.player.move(this._xSpeed);
                if (this._isJumping) {
                    if (this._jumpHeight < 4 * this.player?.height) {
                        this._jumpHeight += this._ySpeed;
                    }
                    this._ySpeed--;
                    this.player.jump(this._ySpeed);
                }
            }
            let isFalling = true;
            this.map?.objects.forEach((mapObj) => {
                this.checkIntersection(mapObj);
                if (!this.checkFalling(mapObj)) isFalling = false;
            });
            if (this._objectForRemoving) {
                this.map?.removeObjects(this._objectForRemoving);
            }
            this._objectForRemoving = [];
            this._isFalling = isFalling;
            if (this._isFalling && this.player && !this._isJumping) {
                console.log("i'm falling!");
                this.player.jump(this._ySpeed);
                this._ySpeed--;
            }
            this.renderplayer();
            this.renderText();
        }, 20);
    }
    // start() {}
    // stop() {}
}
