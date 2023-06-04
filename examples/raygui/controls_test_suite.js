// Initialization
//---------------------------------------------------------------------------------------
let screenWidth = 690;
let screenHeight = 560;

initWindow(screenWidth, screenHeight, "raygui - controls test suite");
setExitKey(0);

// GUI controls initialization
//----------------------------------------------------------------------------------
let dropdownBox000Active = {active: 0};
let dropDown000EditMode = false;

let dropdownBox001Active = {active:0};
let dropDown001EditMode = false;

let spinner001Value = { value: 0 };
let spinnerEditMode = false;

let valueBox002Value = { value: 0 };
let valueBoxEditMode = false;

let textBoxText = { text: "Text box" };
let textBoxEditMode = false;

let listViewScrollIndex = { scrollIndex: 0 };
let listViewActive = -1;

let listViewExScrollIndex = 0;
let listViewExActive = 2;
let listViewExFocus = -1;
let listViewExList = [ "This", "is", "a", "list view", "with", "disable", "elements", "amazing!" ];

let multiTextBoxText = "Multi text box";
let multiTextBoxEditMode = false;
let colorPickerValue = RED;

let sliderValue = 50;
let sliderBarValue = 60;
let progressValue = 0.4;

let forceSquaredChecked = false;

let alphaValue = 0.5;

let comboBoxActive = 1;

let toggleGroupActive = 0;

let viewScroll = new Vector2(0,0);
//----------------------------------------------------------------------------------

// Custom GUI font loading
//let font = loadFontEx("fonts/rainyhearts16.ttf", 12, 0, 0);
//guiSetFont(font);

let exitWindow = false;
let showMessageBox = false;

let textInput = { text: "" }; 
let showTextInputBox = false;

let textInputFileName = "";

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
        let droppedFiles = loadDroppedFiles();

        if ((droppedFiles.length > 0) && isFileExtension(droppedFiles[0], ".rgs")) guiLoadStyle(droppedFiles[0]);
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
        //guiSetStyle(CHECKBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        forceSquaredChecked = guiCheckBox(new Rectangle(25, 108, 15, 15), "FORCE CHECK!", forceSquaredChecked);

        guiSetStyle(TEXTBOX, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);
        //guiSetStyle(VALUEBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (guiSpinner(new Rectangle(25, 135, 125, 30), null, spinner001Value, 0, 100, spinnerEditMode)) spinnerEditMode = !spinnerEditMode;
        if (guiValueBox(new Rectangle(25, 175, 125, 30), null, valueBox002Value, 0, 100, valueBoxEditMode)) valueBoxEditMode = !valueBoxEditMode;
        guiSetStyle(TEXTBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (guiTextBox(new Rectangle(25, 215, 125, 30), textBoxText, textBoxEditMode)) textBoxEditMode = !textBoxEditMode;

        guiSetStyle(BUTTON, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);

        if (guiButton(new Rectangle(25, 255, 125, 30), guiIconText(ICON_FILE_SAVE, "Save File"))) showTextInputBox = true;

        guiGroupBox(new Rectangle(25, 310, 125, 150), "STATES");
        //guiLock();
        guiSetState(STATE_NORMAL); if (guiButton(new Rectangle(30, 320, 115, 30), "NORMAL")) { }
        guiSetState(STATE_FOCUSED); if (guiButton(new Rectangle(30, 355, 115, 30), "FOCUSED")) { }
        guiSetState(STATE_PRESSED); if (guiButton(new Rectangle(30, 390, 115, 30), "#15#PRESSED")) { }
        guiSetState(STATE_DISABLED); if (guiButton(new Rectangle(30, 425, 115, 30), "DISABLED")) { }
        guiSetState(STATE_NORMAL);
        //guiUnlock();

        comboBoxActive = guiComboBox(new Rectangle(25, 470, 125, 30), "ONE;TWO;THREE;FOUR", comboBoxActive);

        // NOTE: GuiDropdownBox must draw after any other control that can be covered on unfolding
        guiUnlock();
        guiSetStyle(DROPDOWNBOX, TEXT_ALIGNMENT, TEXT_ALIGN_LEFT);
        if (guiDropdownBox(new Rectangle(25, 65, 125, 30), "#01#ONE;#02#TWO;#03#THREE;#04#FOUR", dropdownBox001Active, dropDown001EditMode)) dropDown001EditMode = !dropDown001EditMode;

        guiSetStyle(DROPDOWNBOX, TEXT_ALIGNMENT, TEXT_ALIGN_CENTER);
        if (guiDropdownBox(new Rectangle(25, 25, 125, 30), "ONE;TWO;THREE", dropdownBox000Active, dropDown000EditMode)) dropDown000EditMode = !dropDown000EditMode;

        // Second GUI column
        listViewActive = guiListView(new Rectangle(165, 25, 140, 140), "Charmander;Bulbasaur;#18#Squirtel;Pikachu;Eevee;Pidgey", listViewScrollIndex, listViewActive);
        //listViewExActive = guiListViewEx(new Rectangle(165, 180, 140, 200), listViewExList, 8, &listViewExFocus, &listViewExScrollIndex, listViewExActive);

        toggleGroupActive = guiToggleGroup(new Rectangle(165, 400, 140, 25), "#1#ONE\n#3#TWO\n#8#THREE\n#23#", toggleGroupActive);

        // Third GUI column
        guiPanel(new Rectangle(320, 25, 225, 140), "Panel Info");
        colorPickerValue = guiColorPicker(new Rectangle(320, 185, 196, 192), null, colorPickerValue);

        sliderValue = guiSlider(new Rectangle(355, 400, 165, 20), "TEST", Math.floor(sliderValue), sliderValue, -50, 100);
        sliderBarValue = guiSliderBar(new Rectangle(320, 430, 200, 20), null, Math.floor(sliderBarValue), sliderBarValue, 0, 100);
        progressValue = guiProgressBar(new Rectangle(320, 460, 200, 20), null, null, progressValue, 0, 1);

        // NOTE: View rectangle could be used to perform some scissor test
        let view = guiScrollPanel(new Rectangle(560, 25, 102, 354), null, new Rectangle(560, 25, 300, 1200), viewScroll);

        guiGrid(new Rectangle(560, 25 + 180 + 195, 100, 120), null, 20, 2);

        guiStatusBar(new Rectangle(0, getScreenHeight() - 20, getScreenWidth(), 20), "This is a status bar");

        alphaValue = guiColorBarAlpha(new Rectangle(320, 490, 200, 30), null, alphaValue);

        if (showMessageBox)
        {
            drawRectangle(0, 0, getScreenWidth(), getScreenHeight(), fade(RAYWHITE, 0.8));
            let result = guiMessageBox(new Rectangle(getScreenWidth()/2 - 125, getScreenHeight()/2 - 50, 250, 100), guiIconText(ICON_EXIT, "Close Window"), "Do you really want to exit?", "Yes;No");

            if ((result == 0) || (result == 2)) showMessageBox = false;
            else if (result == 1) exitWindow = true;
        }

        if (showTextInputBox)
        {
            drawRectangle(0, 0, getScreenWidth(), getScreenHeight(), fade(RAYWHITE, 0.8));
            let result = guiTextInputBox(new Rectangle(getScreenWidth()/2 - 120, getScreenHeight()/2 - 60, 240, 140), "Save", guiIconText(ICON_FILE_SAVE, "Save file as..."), "Ok;Cancel", textInput, null);

            if (result == 1)
            {
                // TODO: Validate textInput value and save
                textInputFileName = textInput.text
            }

            if ((result == 0) || (result == 1) || (result == 2))
            {
                showTextInputBox = false;
                textInput.text = ""
            }
        }
        //----------------------------------------------------------------------------------

    endDrawing();
    //----------------------------------------------------------------------------------
}

// De-Initialization
//--------------------------------------------------------------------------------------
closeWindow();        // Close window and OpenGL context
//--------------------------------------------------------------------------------------

