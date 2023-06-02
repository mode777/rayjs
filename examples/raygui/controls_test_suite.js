/*******************************************************************************************
*
*   raygui - controls test suite
*
*   TEST CONTROLS:
*       - GuiDropdownBox()
*       - GuiCheckBox()
*       - GuiSpinner()
*       - GuiValueBox()
*       - GuiTextBox()
*       - GuiButton()
*       - GuiComboBox()
*       - GuiListView()
*       - GuiToggleGroup()
*       - GuiColorPicker()
*       - GuiSlider()
*       - GuiSliderBar()
*       - GuiProgressBar()
*       - GuiColorBarAlpha()
*       - GuiScrollPanel()
*
*   LICENSE: zlib/libpng
*
*   Copyright (c) 2016-2023 Ramon Santamaria (@raysan5)
*
**********************************************************************************************/
// Initialization
//--------------------------------------------------------------------------------------
const screenWidth = 690;
const screenHeight = 560;

initWindow(screenWidth, screenHeight, "raygui - controls test suite");
setExitKey(0);

// GUI controls initialization
//----------------------------------------------------------------------------------
let dropdownBox000Active = 0;
let dropDown000EditMode = false;

let dropdownBox001Active = 0;
let dropDown001EditMode = false;

let spinner001Value = 0;
let spinnerEditMode = false;

let valueBox002Value = 0;
let valueBoxEditMode = false;

let textBoxText = "Text box";
let textBoxEditMode = false;

let listViewScrollIndex = 0;
let listViewActive = -1;

let listViewExScrollIndex = 0;
let listViewExActive = 2;
let listViewExFocus = -1;
let listViewExList = [ "This", "is", "a", "list view", "with", "disable", "elements", "amazing!" ];

let multiTextBoxText = "Multi text box";
let multiTextBoxEditMode = false;
let colorPickerValue = RED;

let sliderValue = 50.0;
let sliderBarValue = 60;
let progressValue = 0.4;

let forceSquaredChecked = false;

let alphaValue = 0.5;

let comboBoxActive = 1;

let toggleGroupActive = 0;

let viewScroll = new Vector2(0, 0);
//----------------------------------------------------------------------------------

// Custom GUI font loading
//Font font = LoadFontEx("fonts/rainyhearts16.ttf", 12, 0, 0);
//GuiSetFont(font);

let exitWindow = false;
let showMessageBox = false;

let textInput = new Array(256).fill(0);
let showTextInputBox = false;

let textInputFileName = new Array(256).fill(0);

setTargetFPS(60);
//--------------------------------------------------------------------------------------

// Main game loop
while (!exitWindow)    // Detect window close button or ESC key
{
    // Update
    //----------------------------------------------------------------------------------
    exitWindow = windowShouldClose();

    if (isKeyPressed(KEY_ESCAPE)) showMessageBox = !showMessageBox;

    if (isKeyDown(KEY_LEFT_CONTROL) && isKeyPressed(KEY_S)) showTextInputBox = true;

    if (isFileDropped())
    {
        const droppedFiles = loadDroppedFiles();

        if ((droppedFiles.length > 0) && isFileExtension(droppedFiles[0], ".rgs")) guiLoadStyle(droppedFiles.paths[0]);
    }
    //----------------------------------------------------------------------------------

    // Draw
    //----------------------------------------------------------------------------------
    beginDrawing();

        clearBackground(getColor(guiGetStyle(DEFAULT, BACKGROUND_COLOR)));

        // raygui: controls drawing
        //----------------------------------------------------------------------------------
        // Check all possible events that require GuiLock
        if (dropDown000EditMode ||
            dropDown001EditMode) guiLock();

        // First GUI column
        guiSetStyle(CHECKBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        forceSquareChecked = guiCheckBox(new Rectangle(25, 108, 15, 15), "FORCE CHECK!", forceSquaredChecked);

        guiSetStyle(TEXTBOX, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);
        guiSetStyle(VALUEBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (guiSpinner(new Rectangle(25, 135, 125, 30), NULL, &spinner001Value, 0, 100, spinnerEditMode)) spinnerEditMode = !spinnerEditMode;
        //if (guiValueBox(new Rectangle(25, 175, 125, 30), NULL, &valueBox002Value, 0, 100, valueBoxEditMode)) valueBoxEditMode = !valueBoxEditMode;
        guiSetStyle(TEXTBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (guiTextBox(new Rectangle(25, 215, 125, 30), textBoxText, 64, textBoxEditMode)) textBoxEditMode = !textBoxEditMode;

        guiSetStyle(BUTTON, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);

        if (guiButton(new Rectangle( 25, 255, 125, 30 ), guiIconText(ICON_FILE_SAVE, "Save File"))) showTextInputBox = true;

        guiGroupBox(Rectangle( 25, 310, 125, 150 ), "STATES");
        //GuiLock();
        guiSetState(STATE_NORMAL); if (guiButton(new Rectangle(30, 320, 115, 30), "NORMAL")) { }
        guiSetState(STATE_FOCUSED); if (guiButton(new Rectangle(30, 355, 115, 30), "FOCUSED")) { }
        guiSetState(STATE_PRESSED); if (guiButton(new Rectangle(30, 390, 115, 30), "#15#PRESSED")) { }
        guiSetState(STATE_DISABLED); if (guiButton(new Rectangle(30, 425, 115, 30), "DISABLED")) { }
        guiSetState(STATE_NORMAL);
        //GuiUnlock();

        comboBoxActive = guiComboBox(new Rectangle(25, 470, 125, 30), "ONE;TWO;THREE;FOUR", comboBoxActive);

        // NOTE: GuiDropdownBox must draw after any other control that can be covered on unfolding
        GuiUnlock();
        GuiSetStyle(DROPDOWNBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (GuiDropdownBox(new Rectangle(25, 65, 125, 30), "#01#ONE;#02#TWO;#03#THREE;#04#FOUR", &dropdownBox001Active, dropDown001EditMode)) dropDown001EditMode = !dropDown001EditMode;

        GuiSetStyle(DROPDOWNBOX, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);
        if (GuiDropdownBox(new Rectangle(25, 25, 125, 30), "ONE;TWO;THREE", &dropdownBox000Active, dropDown000EditMode)) dropDown000EditMode = !dropDown000EditMode;

        // Second GUI column
        GuiListView(new Rectangle(165, 25, 140, 140), "Charmander;Bulbasaur;#18#Squirtel;Pikachu;Eevee;Pidgey", &listViewScrollIndex, &listViewActive);
        GuiListViewEx(new Rectangle(165, 180, 140, 200), listViewExList, 8, &listViewExScrollIndex, &listViewExActive, &listViewExFocus);

        //GuiToggle(new Rectangle(165, 400, 140, 25), "#1#ONE", &toggleGroupActive);
        GuiToggleGroup(new Rectangle(165, 400, 140, 25), "#1#ONE\n#3#TWO\n#8#THREE\n#23#", &toggleGroupActive);

        // Third GUI column
        GuiPanel(new Rectangle(320, 25, 225, 140), "Panel Info");
        GuiColorPicker(new Rectangle(320, 185, 196, 192), NULL, &colorPickerValue);

        GuiSlider(new Rectangle(355, 400, 165, 20), "TEST", TextFormat("%2.2f", sliderValue), &sliderValue, -50, 100);
        GuiSliderBar(new Rectangle(320, 430, 200, 20), NULL, TextFormat("%i", (int)sliderBarValue), &sliderBarValue, 0, 100);
        GuiProgressBar(new Rectangle(320, 460, 200, 20), NULL, NULL, &progressValue, 0, 1);

        // NOTE: View rectangle could be used to perform some scissor test
        Rectangle view = { 0 };
        GuiScrollPanel(new Rectangle(560, 25, 102, 354), NULL, new Rectangle(560, 25, 300, 1200), &viewScroll, &view);

        Vector2 mouseCell = { 0 };
        GuiGrid((Rectangle) { 560, 25 + 180 + 195, 100, 120 }, NULL, 20, 2, &mouseCell);

        GuiStatusBar(new Rectangle(0, (float)GetScreenHeight() - 20, (float)GetScreenWidth(), 20), "This is a status bar");

        GuiColorBarAlpha(new Rectangle(320, 490, 200, 30), NULL, &alphaValue);

        if (showMessageBox)
        {
            DrawRectangle(0, 0, GetScreenWidth(), GetScreenHeight(), Fade(RAYWHITE, 0.8f));
            int result = GuiMessageBox(new Rectangle((float)GetScreenWidth()/2 - 125, (float)GetScreenHeight()/2 - 50, 250, 100), GuiIconText(ICON_EXIT, "Close Window"), "Do you really want to exit?", "Yes;No");

            if ((result == 0) || (result == 2)) showMessageBox = false;
            else if (result == 1) exitWindow = true;
        }

        if (showTextInputBox)
        {
            DrawRectangle(0, 0, GetScreenWidth(), GetScreenHeight(), Fade(RAYWHITE, 0.8f));
            int result = GuiTextInputBox(new Rectangle((float)GetScreenWidth()/2 - 120, (float)GetScreenHeight()/2 - 60, 240, 140), "Save", GuiIconText(ICON_FILE_SAVE, "Save file as..."), "Ok;Cancel", textInput, 255, NULL);

            if (result == 1)
            {
                // TODO: Validate textInput value and save

                strcpy(textInputFileName, textInput);
            }

            if ((result == 0) || (result == 1) || (result == 2))
            {
                showTextInputBox = false;
                strcpy(textInput, "\0");
            }
        }
        //----------------------------------------------------------------------------------

    EndDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
CloseWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------