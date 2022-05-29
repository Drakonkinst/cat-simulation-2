// TODO

import { notify } from "./util/notifications";
import { chooseRandom } from "./util/utils";

const dreams = [
    "a blue sea, waves gently lapping against the shore",
    "dark and stormy nights",
    "dreamed of a blazing inferno, heat unbearable",
    "bright skies and lazy clouds",
    "crackling thunder and pouring rain",
    "soft flakes of snow",
    "merciless ice hurtling from the sky",
    "soft whispers and a warm embrace",
    "fish swimming across the sky",
    "a hunter stalking its prey",
    "a world covered in ash",
    "a land of unyielding stone, not a blade of grass in sight",
    "a blazing radiance, the heat of the sun's fury",
    "crimson mist and a wolf's howl",
    "a trident buried deep in the sea",
    "a field of stars, glistening in the darkness"
];

export function randomDream() {
    let dream = chooseRandom(dreams);
    notify("dreamed of " + dream + ".");
}