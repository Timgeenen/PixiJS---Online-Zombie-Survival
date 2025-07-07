import type { Sprite } from 'pixi.js';
import type { Component } from 'react';

export interface SpriteRef extends Component {
    sprite: Sprite;
}
