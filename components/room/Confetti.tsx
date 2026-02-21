import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const COLORS = ["#5865F2", "#57F287"];
const DURATION = 4000;
const BURST_INTERVAL = 200;
const BURSTS = Math.floor(DURATION / BURST_INTERVAL);
const PARTICLES_PER_BURST = 4;

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

interface ParticleProps {
    side: "left" | "right";
    delay: number;
}

function Particle({ side, delay }: ParticleProps) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = randomBetween(10, 15);

    const angleBase = side === "left" ? 60 : 120;
    const spreadOffset = randomBetween(-27.5, 27.5);
    const angleDeg = angleBase + spreadOffset;
    const angleRad = (angleDeg * Math.PI) / 180;

    const distance = randomBetween(height * 0.5, height * 0.95);
    const startX = side === "left" ? 0 : width;
    const startY = height;
    const endX = startX + Math.cos(angleRad) * distance;
    const endY = startY - Math.sin(angleRad) * distance;
    const translateX = useSharedValue(startX);
    const translateY = useSharedValue(startY);
    const opacity = useSharedValue(0);
    const rotate = useSharedValue(0);
    const rotationAmount = randomBetween(180, 720);
    const particleDuration = randomBetween(1800, 2800);

    useEffect(() => {
        const fadeInDuration = 80;
        const visibleDuration = particleDuration * 0.7 - fadeInDuration;
        const fadeOutDuration = particleDuration * 0.3;

        opacity.value = withDelay(
            delay,
            withSequence(
                withTiming(1, { duration: fadeInDuration }),
                withTiming(1, { duration: visibleDuration }), // hold visible
                withTiming(0, { duration: fadeOutDuration })
            )
        );

        translateX.value = withDelay(
            delay,
            withTiming(endX, { duration: particleDuration, easing: Easing.out(Easing.quad) })
        );
        translateY.value = withDelay(
            delay,
            withTiming(endY, { duration: particleDuration * 0.45, easing: Easing.out(Easing.quad) })
        );
        rotate.value = withDelay(
            delay,
            withTiming(rotationAmount, { duration: particleDuration })
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[ styles.particle, animatedStyle,{width: size,height: size * 0.5,backgroundColor: color,borderRadius: 2}]}/>
    );
}

export default function Confetti() {
    const particles: { side: "left" | "right"; delay: number }[] = [];

    for (let burst = 0; burst < BURSTS; burst++) {
        const delay = burst * BURST_INTERVAL;
        for (let p = 0; p < PARTICLES_PER_BURST / 2; p++) {
            particles.push({ side: "left", delay });
            particles.push({ side: "right", delay });
        }
    }

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((p, i) => (
                <Particle key={i} side={p.side} delay={p.delay} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left:0,
        width:"100%",
        height:"100%",
        zIndex: 200,
    },
    particle: {
        position: "absolute",
        top: 0,
        left: 0,
    },
});