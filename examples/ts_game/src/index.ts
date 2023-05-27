import { fadeIn, fadeOut, wait } from "./animation";
import { EntityOf } from "./entity";
import { Game, makeUpdateablePromise } from "./game";
import { TextEntity, makeTextEntity } from "./text";

class MyGame<T> extends Game {
    entities: EntityOf<T>[] = []

    draw(): void {
        for (const entity of this.entities) {
            if(entity.draw) entity.draw(entity)
        }
    }
    update(): void {
        for (const entity of this.entities) {
            if(entity.update) entity.update(entity)
        }
    }
    load(): void {
    }
    unload(): void {
    }

    addEntity(entity: EntityOf<T>){
        this.entities.push(entity)
    }
}

const game = new MyGame<TextEntity>(800,450,"Typescript Game")

const main = async () => {
    const text = <TextEntity>{ 
        ...makeTextEntity("Welcome to rayjs!"),
        size: 80,
        position: new Vector2(100, game.height/2 - 40)
    }
    game.addEntity(text)
    await fadeIn(text, 2)
    await wait(2)
    await fadeOut(text, 2)
    text.position.x += 75
    text.text = "This Summer!"
    await fadeIn(text, 2)
}

main()
game.run()