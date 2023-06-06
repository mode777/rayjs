import { Choice } from "inkjs/engine/Choice";
import { fadeIn, fadeOut, move, wait, waitAnyClicked, waitClick } from "./timing";
import { Builder, combine, withComponent } from "./entity";
import { entityAdd, entityRemove, gameRun } from "./game";
import { ClickableText, makeClickableText, makeParagraph } from "./text";
import { Compiler } from "inkjs";

gameRun({ width: 800, height: 400, title: "The Intercept" }, async (quit) => {
    const source = loadFileText("resources/intercept.ink")
    const c = new Compiler(source!)
    const story = c.Compile()
    traceLog(LOG_INFO, "[INK] Story loaded")

    const textTemplate = {        
        size: 16,
        font: 'resources/anonymous_pro_bold.ttf',
        color: fade(WHITE, 0)
    }

    const makeChoice = combine(makeClickableText, withComponent<{ choice: Choice }>())

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
                move(text, new Vector2(32,64), 1, easeCubicIn)
                await fadeOut(text, 1)
                text.text = txt!
                text.position = new Vector2(32,0)
                move(text, new Vector2(32,32), 1, easeCubicOut)
                await fadeIn(text, 1)
                await waitClick()
            }
        }
        if(story.currentChoices.length == 0) break;
        const choices = story.currentChoices.map((v,i) => makeChoice({ 
            ...textTemplate,  
            choice: v,
            color: RAYWHITE,
            position: new Vector2(getScreenWidth()/2,getScreenHeight()/2+(textTemplate.size + 10)*i),
            text: `(${i}) ${v.text}`,
        }))
        for (const choice of choices) {
            entityAdd(choice)
            choice.position.x += 32
            move(choice, new Vector2(choice.position.x-32,choice.position.y), 1, easeSineOut)
            fadeIn(choice, 1)
            await wait(0.5)
        }
        const choiceIdx = await waitAnyClicked(choices) 
        traceLog(LOG_INFO, "Clicked: " + choiceIdx)
        story.ChooseChoiceIndex(choiceIdx)
        choices.forEach(x => { move(x, vector2Add(x.position,new Vector2(-32,0)), 1, easeSineIn); fadeOut(x, 1) })
        await wait(1)
        choices.forEach(x => entityRemove(x))
    }
    
})
