import { fadeIn, fadeOut, wait } from "./animation";
import { entityAdd, entityRemove, runGame } from "./game";
import { TextEntity, makeTextEntity } from "./text";

runGame(800,400, "Typescript Game", async () => {
    const text = <TextEntity>{ 
        ...makeTextEntity("Welcome to rayjs!"),
        size: 80,
        position: new Vector2(100, getScreenHeight()/2 - 40),
        font: 'resources/anonymous_pro_bold.ttf'
    }
    let quit = false
    entityAdd(text)
    while(!quit){
        await fadeIn(text, 2)
        await wait(2)
        await fadeOut(text, 2)
        text.text = "This Summer!"
        await fadeIn(text, 2)
        await fadeOut(text, 3)
        entityRemove(text)
    }
})
