import { Choice } from "inkjs/engine/Choice";
import { fadeIn, fadeOut, wait, waitClick, waitEntityClicked, waitFrame, waitKeyPressed } from "./animation";
import { Builder, Clickable, addBehaviour, debugRectDrawBehaviour, makeCombined, setProp } from "./entity";
import { entityAdd, entityRemove, runGame } from "./game";
import { ClickableText as ClickableText, Text, makeClickableText as makeClickableText, makeParagraph, makeText as makeText } from "./text";
import { Compiler } from "inkjs";



runGame(800,400, "Typescript Game", async (quit) => {
    const source = loadFileText("resources/intercept.ink")
    const c = new Compiler(source)
    const story = c.Compile()
    traceLog(LOG_INFO, "[INK] Story loaded")

    const textTemplate = {        
        size: 16,
        font: 'resources/anonymous_pro_bold.ttf',
        color: fade(WHITE, 0)
    }

    interface HasChoice { choice: Choice }
    type ChoiceEntity = ClickableText & HasChoice
    const makeChoice: Builder<ChoiceEntity> = makeCombined(makeClickableText, (obj: ClickableText & Partial<HasChoice>) => {
        setProp(obj, "choice", null)
        return <ChoiceEntity>obj
    })

    const text = makeParagraph({ 
        ...textTemplate, 
        position: new Vector2(32,32),
        maxWidth: getScreenWidth()/2 - 64
    })
    entityAdd(text)

    while(true){
        while(story.canContinue){
            const txt = story.Continue()
            if(txt?.trim() !== ''){
                await fadeOut(text, 1, easeCubicOut)
                text.text = txt!
                await fadeIn(text, 1, easeCubicInOut)
                await waitClick()
            }
        }
        if(story.currentChoices.length == 0) break;
        const choices = story.currentChoices.map((v,i) => makeChoice({ 
            ...textTemplate,  
            choice: v,
            color: RAYWHITE,
            //debugClickable: true,
            position: new Vector2(getScreenWidth()/2,getScreenHeight()/2+(textTemplate.size + 10)*i),
            text: `(${i}) ${v.text}`,
        }))
        for (const choice of choices) {
            entityAdd(choice)
            fadeIn(choice, 1)
            await wait(0.5)
        }
        let choiceIdx = -1
        await Promise.race(choices.map(x => waitEntityClicked(x).then(() => choiceIdx = x.choice.index)))
        traceLog(LOG_INFO, "Clicked: " + choiceIdx)
        choices.forEach(x => entityRemove(x))
        story.ChooseChoiceIndex(choiceIdx)
    }
    
})
