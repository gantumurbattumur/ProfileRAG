import { useEffect, useRef, useCallback } from "react";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 340;
const GROUND_Y = 290;
const PIXEL_SIZE = 8;

// Animation states
const STATES = {
    WALKING_TO_DESK: 'walking_to_desk',
    SITTING_DOWN: 'sitting_down',
    WORKING: 'working',
    STANDING_UP: 'standing_up',
    WALKING_TO_GYM: 'walking_to_gym',
    LIFTING: 'lifting',
    WALKING_TO_BALL: 'walking_to_ball',
    PICKING_BALL: 'picking_ball',
    SHOOTING: 'shooting',
    WALKING_TO_MUSIC: 'walking_to_music',
    LISTENING: 'listening',
    WALKING_OUT: 'walking_out',
};

// Scene positions (scaled up)
const DESK_X = 200;
const GYM_X = 470;
const BALL_X = 700;
const HOOP_X = 830;
const MUSIC_X = 1050;

export default function DayInLife() {
    const canvasRef = useRef(null);
    const animRef = useRef({
        x: -40,
        state: STATES.WALKING_TO_DESK,
        frameCount: 0,
        stateTimer: 0,
        clockAngle: 0,
        ballY: 0,
        ballX: 0,
        ballVisible: false,
        ballInHoop: false,
        liftFrame: 0,
        hasHeadphones: false,
    });
    const animationRef = useRef(null);

    const resetGame = useCallback(() => {
        const game = gameRef.current;
        game.player = { x: 50, y: GROUND_Y - PLAYER_HEIGHT, vy: 0, isJumping: false };
        game.obstacles = [];
        game.score = 0;
        game.speed = INITIAL_SPEED;
        game.gameOver = false;
        game.started = true;
        game.frameCount = 0;
    }, []);

    const jump = useCallback(() => {
        const game = gameRef.current;
        if (game.gameOver) {
            resetGame();
            return;
        }
        if (!game.started) {
            game.started = true;
            return;
        }
        if (!game.player.isJumping) {
            game.player.vy = JUMP_FORCE;
            game.player.isJumping = true;
        }
    }, [resetGame]);

    // Pixel art helper
    const drawPixel = (ctx, x, y, size = PIXEL_SIZE) => {
        ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    };

    // Draw clock
    const drawClock = useCallback((ctx, angle) => {
        const cx = CANVAS_WIDTH - 60;
        const cy = 55;
        const r = 40;
        const p = 4;

        // Clock face (cream)
        ctx.fillStyle = "#FFF8E7";
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
            for (let ri = 0; ri < r; ri += p) {
                drawPixel(ctx, cx + Math.cos(a) * ri - p / 2, cy + Math.sin(a) * ri - p / 2, p);
            }
        }

        // Clock border
        ctx.fillStyle = "#8B7355";
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
            drawPixel(ctx, cx + Math.cos(a) * r - p / 2, cy + Math.sin(a) * r - p / 2, p);
        }

        // Hour marks
        ctx.fillStyle = "#2D2D2D";
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            drawPixel(ctx, cx + Math.cos(a) * (r - 8) - 2, cy + Math.sin(a) * (r - 8) - 2, 5);
        }

        // Hour hand (short)
        const hourAngle = angle / 12 - Math.PI / 2;
        ctx.fillStyle = "#2D2D2D";
        for (let i = 0; i < 18; i += 3) {
            drawPixel(ctx, cx + Math.cos(hourAngle) * i - 2, cy + Math.sin(hourAngle) * i - 2, 5);
        }

        // Minute hand (long)
        const minAngle = angle - Math.PI / 2;
        ctx.fillStyle = "#D4A574";
        for (let i = 0; i < 28; i += 3) {
            drawPixel(ctx, cx + Math.cos(minAngle) * i - 2, cy + Math.sin(minAngle) * i - 2, 4);
        }

        // Center dot
        ctx.fillStyle = "#2D2D2D";
        drawPixel(ctx, cx - 3, cy - 3, 6);
    }, []);

    // Draw character - walking, sitting, lifting, shooting, or with headphones
    // Character is 2x bigger than other elements
    const drawCharacter = useCallback((ctx, x, y, frame, options = {}) => {
        const { sitting = false, lifting = false, shooting = false, headphones = false, liftFrame = 0 } = options;
        const p = PIXEL_SIZE * 2; // 2x size for character
        const armSize = PIXEL_SIZE * 1.2; // Smaller arms
        const walkFrame = Math.floor(frame / 10) % 2;

        if (sitting) {
            // SITTING POSE (side view) - character on chair facing laptop (screen on right)
            const charY = y;

            // Head
            ctx.fillStyle = "#E8C4A0";
            drawPixel(ctx, x + p * 1, charY - p * 4, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 4, p);
            drawPixel(ctx, x + p * 1, charY - p * 3.5, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 3.5, p);

            // Hair
            ctx.fillStyle = "#2D2D2D";
            drawPixel(ctx, x + p * 1, charY - p * 4.5, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 4.5, p);

            // Glasses
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(x + p * 1.5 + 2, charY - p * 3.7, p * 0.8, 4);

            // Body (torso)
            ctx.fillStyle = "#4A90D9";
            drawPixel(ctx, x + p * 1, charY - p * 3, p);
            drawPixel(ctx, x + p * 1, charY - p * 2.5, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 3, p);

            // Arm reaching to laptop keyboard (smaller)
            ctx.fillStyle = "#E8C4A0";
            drawPixel(ctx, x + p * 2, charY - p * 2.5, armSize);
            drawPixel(ctx, x + p * 2.5, charY - p * 2.5, armSize);

            // Legs (bent, sitting)
            ctx.fillStyle = "#2D2D2D";
            drawPixel(ctx, x + p * 1, charY - p * 2, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 2, p);
            drawPixel(ctx, x + p * 1.5, charY - p * 1.5, p);
            drawPixel(ctx, x + p * 2, charY - p * 1.5, p);

            return;
        }

        // STANDING/WALKING POSE - positioned to touch ground
        const charY = y - p * 3;

        // Head
        ctx.fillStyle = "#E8C4A0";
        drawPixel(ctx, x + p * 0.5, charY, p);
        drawPixel(ctx, x + p * 1, charY, p);
        drawPixel(ctx, x + p * 0.5, charY + p * 0.5, p);
        drawPixel(ctx, x + p * 1, charY + p * 0.5, p);

        // Hair
        ctx.fillStyle = "#2D2D2D";
        drawPixel(ctx, x + p * 0.5, charY - p * 0.5, p);
        drawPixel(ctx, x + p * 1, charY - p * 0.5, p);

        // Headphones if listening
        if (headphones) {
            ctx.fillStyle = "#2D2D2D";
            drawPixel(ctx, x + p * 0.2, charY - p * 0.3, p * 0.8);
            drawPixel(ctx, x + p * 1.3, charY - p * 0.3, p * 0.8);
            ctx.fillStyle = "#E74C3C";
            drawPixel(ctx, x, charY + p * 0.2, p * 0.8);
            drawPixel(ctx, x + p * 1.5, charY + p * 0.2, p * 0.8);
        }

        // Glasses
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(x + p * 0.5, charY + p * 0.2, p * 1, 4);

        // Body
        ctx.fillStyle = "#4A90D9";
        drawPixel(ctx, x + p * 0.5, charY + p * 1, p);
        drawPixel(ctx, x + p * 1, charY + p * 1, p);
        drawPixel(ctx, x + p * 0.5, charY + p * 1.5, p);
        drawPixel(ctx, x + p * 1, charY + p * 1.5, p);

        // Arms (smaller size)
        ctx.fillStyle = "#E8C4A0";
        if (lifting) {
            const armUp = liftFrame % 2 === 0;
            if (armUp) {
                drawPixel(ctx, x, charY + p * 0.5, armSize);
                drawPixel(ctx, x + p * 1.5, charY + p * 0.5, armSize);
            } else {
                drawPixel(ctx, x, charY + p * 1, armSize);
                drawPixel(ctx, x + p * 1.5, charY + p * 1, armSize);
            }
        } else if (shooting) {
            drawPixel(ctx, x + p * 1.5, charY + p * 0.5, armSize);
            drawPixel(ctx, x + p * 1.5, charY, armSize);
        } else {
            drawPixel(ctx, x, charY + p * 1, armSize);
            drawPixel(ctx, x + p * 1.5, charY + p * 1, armSize);
        }

        // Legs
        ctx.fillStyle = "#2D2D2D";
        drawPixel(ctx, x + p * 0.5, charY + p * 2, p);
        drawPixel(ctx, x + p * 1, charY + p * 2, p);

        if (walkFrame === 0) {
            drawPixel(ctx, x + p * 0.3, charY + p * 2.5, p);
            drawPixel(ctx, x + p * 1, charY + p * 2.5, p);
        } else {
            drawPixel(ctx, x + p * 0.5, charY + p * 2.5, p);
            drawPixel(ctx, x + p * 1.2, charY + p * 2.5, p);
        }

        // Dumbbell if lifting (smaller to match arms)
        if (lifting) {
            const armUp = liftFrame % 2 === 0;
            const dumbbellY = armUp ? charY + p * 0.3 : charY + p * 0.8;
            ctx.fillStyle = "#4A4A4A";
            drawPixel(ctx, x - p * 0.3, dumbbellY, armSize);
            drawPixel(ctx, x + p * 1.7, dumbbellY, armSize);
        }
    }, []);

    // Draw desk with laptop (side view - simple and clean)
    const drawDesk = useCallback((ctx, x, frame = 0) => {
        const p = PIXEL_SIZE;
        const y = GROUND_Y;

        // Chair (side view) - simple back and seat
        ctx.fillStyle = "#4A4A4A";
        // Chair back
        drawPixel(ctx, x, y - p * 6, p);
        drawPixel(ctx, x, y - p * 5, p);
        drawPixel(ctx, x, y - p * 4, p);
        drawPixel(ctx, x, y - p * 3, p);
        // Chair seat
        drawPixel(ctx, x, y - p * 2, p);
        drawPixel(ctx, x + p, y - p * 2, p);
        drawPixel(ctx, x + p * 2, y - p * 2, p);
        // Chair leg
        drawPixel(ctx, x + p, y - p, p);

        // Table (side view) - simple surface and legs
        ctx.fillStyle = "#8B7355";
        // Table top
        for (let i = 3; i < 12; i++) {
            drawPixel(ctx, x + p * i, y - p * 3, p);
        }
        // Table legs
        ctx.fillStyle = "#6B5344";
        drawPixel(ctx, x + p * 4, y - p * 2, p);
        drawPixel(ctx, x + p * 4, y - p, p);
        drawPixel(ctx, x + p * 10, y - p * 2, p);
        drawPixel(ctx, x + p * 10, y - p, p);

        // Laptop (side view) - screen opens to the right
        ctx.fillStyle = "#2D2D2D";
        // Laptop base (horizontal)
        drawPixel(ctx, x + p * 6, y - p * 4, p);
        drawPixel(ctx, x + p * 7, y - p * 4, p);
        drawPixel(ctx, x + p * 8, y - p * 4, p);
        // Laptop screen (vertical, opens right)
        drawPixel(ctx, x + p * 8, y - p * 5, p);
        drawPixel(ctx, x + p * 8, y - p * 6, p);
        drawPixel(ctx, x + p * 8, y - p * 7, p);

        // Screen glow (small indicator that it's on)
        if (Math.floor(frame / 20) % 2 === 0) {
            ctx.fillStyle = "#4A90D9";
        } else {
            ctx.fillStyle = "#6BA5E7";
        }
        ctx.fillRect(x + p * 8 + 1, y - p * 6.5, p - 2, p * 1.5);
    }, []);

    // Draw basketball and hoop
    const drawBasketball = useCallback((ctx, x, y) => {
        const p = PIXEL_SIZE;

        // Ball (orange)
        ctx.fillStyle = "#E67E22";
        drawPixel(ctx, x, y, p);
        drawPixel(ctx, x + p, y, p);
        drawPixel(ctx, x + p * 2, y, p);
        drawPixel(ctx, x, y + p, p);
        drawPixel(ctx, x + p, y + p, p);
        drawPixel(ctx, x + p * 2, y + p, p);
        drawPixel(ctx, x, y + p * 2, p);
        drawPixel(ctx, x + p, y + p * 2, p);
        drawPixel(ctx, x + p * 2, y + p * 2, p);

        // Ball lines
        ctx.fillStyle = "#2D2D2D";
        ctx.fillRect(x + p + 1, y, 2, p * 3);
        ctx.fillRect(x, y + p + 1, p * 3, 2);
    }, []);

    const drawHoop = useCallback((ctx, x) => {
        const p = PIXEL_SIZE;
        const y = GROUND_Y - p * 12;

        // Backboard (white)
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < 5; i++) {
            drawPixel(ctx, x + p * 2, y + p * i, p);
            drawPixel(ctx, x + p * 3, y + p * i, p);
            drawPixel(ctx, x + p * 4, y + p * i, p);
            drawPixel(ctx, x + p * 5, y + p * i, p);
        }
        // Backboard red square
        ctx.fillStyle = "#E74C3C";
        drawPixel(ctx, x + p * 3, y + p * 2, p);
        drawPixel(ctx, x + p * 4, y + p * 2, p);
        drawPixel(ctx, x + p * 3, y + p * 3, p);
        drawPixel(ctx, x + p * 4, y + p * 3, p);

        // Rim (orange)
        ctx.fillStyle = "#E67E22";
        drawPixel(ctx, x, y + p * 4, p);
        drawPixel(ctx, x + p, y + p * 4, p);
        drawPixel(ctx, x + p * 2, y + p * 4, p);

        // Net (white lines)
        ctx.fillStyle = "#DDDDDD";
        ctx.fillRect(x + 2, y + p * 5, 2, p * 2);
        ctx.fillRect(x + p + 2, y + p * 5, 2, p * 2 + 3);
        ctx.fillRect(x + p * 2 + 2, y + p * 5, 2, p * 2);

        // Pole (gray)
        ctx.fillStyle = "#4A4A4A";
        for (let i = 4; i < 12; i++) {
            drawPixel(ctx, x + p * 5, y + p * i, p);
        }
    }, []);

    // Draw gym equipment (dumbbell rack)
    const drawGym = useCallback((ctx, x) => {
        const p = PIXEL_SIZE;
        const y = GROUND_Y - p * 6;

        // Rack frame (dark gray)
        ctx.fillStyle = "#4A4A4A";
        // Vertical posts
        drawPixel(ctx, x, y, p);
        drawPixel(ctx, x, y + p, p);
        drawPixel(ctx, x, y + p * 2, p);
        drawPixel(ctx, x, y + p * 3, p);
        drawPixel(ctx, x, y + p * 4, p);
        drawPixel(ctx, x, y + p * 5, p);
        drawPixel(ctx, x + p * 6, y, p);
        drawPixel(ctx, x + p * 6, y + p, p);
        drawPixel(ctx, x + p * 6, y + p * 2, p);
        drawPixel(ctx, x + p * 6, y + p * 3, p);
        drawPixel(ctx, x + p * 6, y + p * 4, p);
        drawPixel(ctx, x + p * 6, y + p * 5, p);

        // Shelves
        ctx.fillStyle = "#6B6B6B";
        for (let i = 1; i < 6; i++) {
            drawPixel(ctx, x + p * i, y + p * 2, p);
            drawPixel(ctx, x + p * i, y + p * 4, p);
        }

        // Dumbbells on rack
        ctx.fillStyle = "#2D2D2D";
        drawPixel(ctx, x + p * 2, y + p, p);
        drawPixel(ctx, x + p * 3, y + p, p);
        drawPixel(ctx, x + p * 4, y + p, p);
        drawPixel(ctx, x + p * 2, y + p * 3, p);
        drawPixel(ctx, x + p * 3, y + p * 3, p);
        drawPixel(ctx, x + p * 4, y + p * 3, p);

        // Weight plates (red accents)
        ctx.fillStyle = "#E74C3C";
        drawPixel(ctx, x + p * 1.5, y + p, p * 0.7);
        drawPixel(ctx, x + p * 4.5, y + p, p * 0.7);
        drawPixel(ctx, x + p * 1.5, y + p * 3, p * 0.7);
        drawPixel(ctx, x + p * 4.5, y + p * 3, p * 0.7);
    }, []);

    // Draw music player / speaker
    const drawMusicPlayer = useCallback((ctx, x) => {
        const p = PIXEL_SIZE;
        const y = GROUND_Y - p * 5;

        // Speaker body (dark)
        ctx.fillStyle = "#2D2D2D";
        for (let i = 0; i < 4; i++) {
            drawPixel(ctx, x, y + p * i, p);
            drawPixel(ctx, x + p, y + p * i, p);
            drawPixel(ctx, x + p * 2, y + p * i, p);
            drawPixel(ctx, x + p * 3, y + p * i, p);
        }
        drawPixel(ctx, x, y + p * 4, p);
        drawPixel(ctx, x + p, y + p * 4, p);
        drawPixel(ctx, x + p * 2, y + p * 4, p);
        drawPixel(ctx, x + p * 3, y + p * 4, p);

        // Speaker cone (gray circles)
        ctx.fillStyle = "#6B6B6B";
        drawPixel(ctx, x + p, y + p, p);
        drawPixel(ctx, x + p * 2, y + p, p);
        drawPixel(ctx, x + p, y + p * 2, p);
        drawPixel(ctx, x + p * 2, y + p * 2, p);

        // Speaker center
        ctx.fillStyle = "#4A4A4A";
        ctx.fillRect(x + p + 2, y + p + 2, p, p);

        // Music notes floating (animated via frame)
        ctx.fillStyle = "#D4A574";
        const noteOffset = Math.sin(animRef.current.frameCount * 0.1) * 3;
        drawPixel(ctx, x + p * 4, y - p + noteOffset, p * 0.6);
        drawPixel(ctx, x + p * 4.5, y - p * 1.5 - noteOffset, p * 0.6);
        ctx.fillRect(x + p * 4 + 2, y - p + noteOffset, 2, p);
        ctx.fillRect(x + p * 4.5 + 2, y - p * 1.5 - noteOffset, 2, p);
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const anim = animRef.current;

        ctx.imageSmoothingEnabled = false;

        // Clear canvas
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw pixelated ground
        ctx.fillStyle = "#E8E4DF";
        for (let i = 0; i < CANVAS_WIDTH; i += PIXEL_SIZE * 2) {
            drawPixel(ctx, i, GROUND_Y, PIXEL_SIZE);
        }
        ctx.fillStyle = "#D4C4B0";
        for (let i = PIXEL_SIZE; i < CANVAS_WIDTH; i += PIXEL_SIZE * 4) {
            drawPixel(ctx, i, GROUND_Y + PIXEL_SIZE, PIXEL_SIZE);
        }

        // Update clock (full rotation = full animation cycle)
        anim.clockAngle += 0.02;
        drawClock(ctx, anim.clockAngle);

        // Draw static elements
        drawDesk(ctx, DESK_X, anim.frameCount);
        drawGym(ctx, GYM_X);
        drawHoop(ctx, HOOP_X);
        drawMusicPlayer(ctx, MUSIC_X);

        // Draw basketball on ground if not in play
        const showBall = anim.state === STATES.WALKING_TO_DESK ||
            anim.state === STATES.SITTING_DOWN ||
            anim.state === STATES.WORKING ||
            anim.state === STATES.STANDING_UP ||
            anim.state === STATES.WALKING_TO_GYM ||
            anim.state === STATES.LIFTING ||
            anim.state === STATES.WALKING_TO_BALL;
        if (showBall && !anim.ballVisible) {
            drawBasketball(ctx, BALL_X, GROUND_Y - PIXEL_SIZE * 3);
        }

        // Draw ball in air if shooting
        if (anim.ballVisible) {
            drawBasketball(ctx, anim.ballX, anim.ballY);
        }

        anim.frameCount++;
        anim.stateTimer++;

        // State machine
        switch (anim.state) {
            case STATES.WALKING_TO_DESK:
                anim.x += 2;
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount);
                if (anim.x >= DESK_X - 5) {
                    anim.state = STATES.SITTING_DOWN;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.SITTING_DOWN:
                drawCharacter(ctx, DESK_X, GROUND_Y, anim.frameCount, { sitting: true });
                if (anim.stateTimer > 20) {
                    anim.state = STATES.WORKING;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.WORKING:
                drawCharacter(ctx, DESK_X, GROUND_Y, anim.frameCount, { sitting: true });
                if (anim.stateTimer > 100) {
                    anim.state = STATES.STANDING_UP;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.STANDING_UP:
                drawCharacter(ctx, DESK_X, GROUND_Y, anim.frameCount);
                if (anim.stateTimer > 15) {
                    anim.state = STATES.WALKING_TO_GYM;
                    anim.x = DESK_X;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.WALKING_TO_GYM:
                anim.x += 2;
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount);
                if (anim.x >= GYM_X - 15) {
                    anim.state = STATES.LIFTING;
                    anim.stateTimer = 0;
                    anim.liftFrame = 0;
                }
                break;

            case STATES.LIFTING:
                anim.liftFrame = Math.floor(anim.stateTimer / 20);
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount, { lifting: true, liftFrame: anim.liftFrame });
                if (anim.stateTimer > 80) {
                    anim.state = STATES.WALKING_TO_BALL;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.WALKING_TO_BALL:
                anim.x += 2;
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount);
                if (anim.x >= BALL_X - 20) {
                    anim.state = STATES.PICKING_BALL;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.PICKING_BALL:
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount, { shooting: true });
                if (anim.stateTimer > 25) {
                    anim.state = STATES.SHOOTING;
                    anim.ballVisible = true;
                    anim.ballX = anim.x + PIXEL_SIZE * 4;
                    anim.ballY = GROUND_Y - PIXEL_SIZE * 7;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.SHOOTING:
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount, { shooting: true });
                // Ball arc animation
                const shootProgress = anim.stateTimer / 35;
                anim.ballX = anim.x + PIXEL_SIZE * 4 + shootProgress * (HOOP_X - anim.x);
                anim.ballY = (GROUND_Y - PIXEL_SIZE * 7) - Math.sin(shootProgress * Math.PI) * 55;

                if (anim.stateTimer > 35) {
                    anim.ballVisible = false;
                    anim.state = STATES.WALKING_TO_MUSIC;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.WALKING_TO_MUSIC:
                anim.x += 2;
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount);
                if (anim.x >= MUSIC_X - 30) {
                    anim.state = STATES.LISTENING;
                    anim.hasHeadphones = true;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.LISTENING:
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount, { headphones: true });
                if (anim.stateTimer > 80) {
                    anim.state = STATES.WALKING_OUT;
                    anim.stateTimer = 0;
                }
                break;

            case STATES.WALKING_OUT:
                anim.x += 2;
                drawCharacter(ctx, anim.x, GROUND_Y, anim.frameCount, { headphones: anim.hasHeadphones });
                if (anim.x > CANVAS_WIDTH + 40) {
                    // Reset everything for the loop
                    anim.x = -40;
                    anim.state = STATES.WALKING_TO_DESK;
                    anim.hasHeadphones = false;
                    anim.ballVisible = false;
                    anim.stateTimer = 0;
                }
                break;
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [drawClock, drawCharacter, drawDesk, drawGym, drawHoop, drawBasketball, drawMusicPlayer]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    return (
        <div className="flex flex-col items-center mb-6">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="rounded-lg max-w-full"
                style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-primary)",
                    imageRendering: "pixelated",
                }}
            />
        </div>
    );
}
