#version 330
in vec2 fragTexCoord;
in vec4 fragColor;
out vec4 finalColor;
uniform sampler2D texture0;
uniform vec4 colDiffuse;
uniform float intensity;
void main()
{
    vec4 texelColor = texture(texture0, fragTexCoord); 
    texelColor = texelColor*colDiffuse*fragColor*vec4(intensity, intensity, intensity, 1.0);
    finalColor = vec4(texelColor.rgb, (gl_FrontFacing ? 1.0 : 0.0));
}